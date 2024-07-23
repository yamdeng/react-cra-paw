import "./App.css";
import localforage from 'localforage';
import React, { useEffect, useState, useRef, useCallback } from "react";
import initSqlJs from 'sql.js';
import { set as idbSet, get as idbGet } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import "./output.css";
import { create } from 'zustand'
import { produce } from 'immer';

/**
 * DB 수동 삭제: chrome console에서 실행할 것
 * -- indexedDB.deleteDatabase('ksms-offline-data')
 * -- indexedDB.deleteDatabase('ksms-offline-data')
 * 
 * 레포트 작성시 저장 프로세스
 * (1) 레포트 화면 진입시 현재의 UUID를 설정
 * (2) 레포트 작성 중간에 첨부파일을 추가하게 되면 ()
 */

const DB_SQLJS_NAME = `ksms-offline-data`

const TABLE_REPORT = `CREATE TABLE IF NOT EXISTS 
  report 
(id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, payload TEXT);`

const TABLE_ATTACHMENT = `CREATE TABLE IF NOT EXISTS
  attachment
(id INTEGER PRIMARY KEY AUTOINCREMENT, report_id INTEGER, filename TEXT, size INTEGER, attachment TEXT);`

const INSERT_REPORT = `INSERT INTO report (category, payload) VALUES (?, ?);`

const INSERT_ATTACHMENT = `INSERT INTO attachment (report_id, filename, size, attachment) VALUES (?, ?, ?, ?);`

const SELECT_LASTEST_REPORT_ID = `SELECT
  id
FROM report
ORDER BY id DESC LIMIT 1;`

const SELECT_REPORT_BY_ID = `SELECT 
  report.id,
  report.category,
  report.payload,
  attachment.report_id,
  attachment.filename,
  attachment.attachment
FROM report 
LEFT JOIN attachment
ON report.id = attachment.report_id 
WHERE report.id = ? ;`

const SELECT_REPORT = `SELECT 
  id,
  category,
  payload
FROM report;`

const SELECT_REPORT_JOIN_ATTACHMENT = `SELECT 
  report.id,
  report.category,
  report.payload,
  attachment.report_id,
  attachment.filename,
  attachment.attachment
FROM report 
LEFT OUTER JOIN attachment
ON report.id = attachment.report_id;`

const SELECT_ATTACHMENT_FULL = `SELECT
  id,
  report_id,
  filename,
  size,
  attachment
FROM attachment;`

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

export class BitShiftHelper {

  constructor() {
    if (BitShiftHelper.instance) {
      return BitShiftHelper.instance;
    }

    this.completionBit = 0b0;
    this.currentBit = 0b0;
    this.callback = () => { };
    BitShiftHelper.instance = this;
  }

  fetchCurrent(fetchBit) {
    this.currentBit |= fetchBit
    if (this.currentBit === this.completionBit) {
      this.callback?.();
      this.callback = undefined;
    }
  }

  setupCompletion(count) {
    let i = 0;
    do {
      shiftHelper.completionBit = shiftHelper.completionBit | 0x0001 << i;
      i++;
    } while (i < count);
  }

  debug() {
    console.log(`currentBit: ${this.currentBit.toString(2)}, completionBit: ${this.completionBit.toString(2)}`)
  }
}

const shiftHelper = new BitShiftHelper();

const initailState = {
  rootName: 'yamdeng',
  db: {},
  reports: [],
  attachments: [],
  formData: new FormData(),
  getFormArray: () => { },
  handleFileChange: () => { },
  removeFormFile: () => { },
  commit: () => { }
};

const databaseStore = create((set, get) => ({
  ...initailState,
  initializeDB: async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `/sql-wasm-1.10.3.wasm`
      });
      const savedDb = await idbGet(DB_SQLJS_NAME);
      if (savedDb) {
        set({ db: new SQL.Database(new Uint8Array(savedDb)) })
      } else {
        set({ db: new SQL.Database() })
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  },
  createDB: () => {
    const { db, commit } = get()
    // 테이블 생성
    db.run(`${TABLE_REPORT}`);
    db.run(`${TABLE_ATTACHMENT}`);
    commit();
  },
  handleFileChange: (event) => {
    const { getFormArray } = get()
    if (!event.target.files[0]) return;
    const formData = new FormData();
    let index = 0;
    getFormArray().forEach(([key, file], i) => {
      formData.append(`file${i}`, file)
      index++;
    })
    formData.append(`file${index}`, event.target.files[0]);
    set({ formData: formData });
  },
  getFormArray: () => {
    const { formData } = get()
    return Array.from(formData.entries())
  },
  refreshReports: () => {
    const { db } = get()
    const stmt = db.prepare(SELECT_REPORT_JOIN_ATTACHMENT);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    console.log(`refreshReports: ${result}`)
    set({ reports: result })
  },
  refreshAttachment: () => {
    const { db } = get()
    const stmt = db.prepare(SELECT_ATTACHMENT_FULL);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    console.log(`refreshAttachment: ${result}`)
    set({ attachments: result })
  },
  insertReportToDB: (report_id, fileMaps) => {
    const { db } = get()
    // 보고서 저장
    db.run(`${INSERT_REPORT}`, ['CSR', '{}']);

    const stmt = db.prepare(SELECT_LASTEST_REPORT_ID);

    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }

    if (result.length > 0) {
      const report_id = result[0].id;
      console.log(`Save Report 'id': ${report_id}`)
      return report_id;
    } else {
      alert("레포트 작성 저장 중 오류가 발생했습니다.");
      return null;
    }
  },
  insertAttachmentToDB: (report_id, fileMaps) => {
    const { db } = get()
    // 첨부파일 DB 업데이트
    console.log(fileMaps);
    fileMaps.map((element, index) => {
      //console.log(`index: ${index}`)
    })
    fileMaps.forEach((element, index) => {
      //console.log(`file: ${element}`)
      db.run(`${INSERT_ATTACHMENT}`, [report_id, element.filename, element.size, element.key])
    })
  },
  saveReport: async () => {

    const { commit, fetchReport, getFormArray, insertReportToDB, insertAttachmentToDB } = get()

    // 파일 목록
    let fileMaps = [];

    shiftHelper.setupCompletion(getFormArray().length);
    shiftHelper.callback = () => {
      // 1초후 보고서 DB 저장
      delay(1000).then(() => {
        let report_id = insertReportToDB();
        report_id && insertAttachmentToDB(report_id, fileMaps);
        commit();
        fetchReport();
        set({ formData: new FormData() });
      })
    }

    // 첨부파일 local 저장
    let i = 0;
    getFormArray().forEach(async ([key, file]) => {

      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result;

          try {
            // 파일 키를 생성하거나 수정합니다.
            const fileKey = uuidv4(); // 이 함수는 파일 키를 생성하거나 가져오는 로직입니다.
            await localforage.setItem(fileKey, arrayBuffer);
            console.log('File successfully saved to IndexedDB.');

            // 현재 파일 키들을 로그로 출력
            const fileKeys = await localforage.keys();
            console.log(`current file keys: ${fileKeys.join(',')}`);

            // 저장된 파일 키들을 확인
            fileKeys.forEach((key) => {
              //console.log(`Stored file key: ${key}`);
            });
            fileMaps.push({ 'key': fileKey, 'filename': file.name, 'size': file.size })
            shiftHelper.fetchCurrent(0x1 << i);
            i++;
          } catch (storageError) {
            console.error('Error saving file to IndexedDB:', storageError);
            alert('파일 업로드 중 오류가 발생했습니다.');
          }
        }
        reader.readAsArrayBuffer(file);
      }
    })
  },
  fetchReport: () => {
    const { refreshReports, refreshAttachment } = get()
    refreshReports();
    refreshAttachment();
  },
  removeFormFile: (fileToRemove) => {
    const { getFormArray } = get()
    let formData = new FormData();
    let index = 0;
    getFormArray().forEach(([key, file], _) => {
      if (key !== fileToRemove) {
        formData.append(`file${index}`, file)
        index++;
      }
    })
  },
  commit: async () => {
    const { db } = get()
    const dbData = db.export();
    await idbSet(DB_SQLJS_NAME, dbData);
  }
}))

function OffLineRefactoring() {
  const {
    initializeDB,
    createDB,
    fetchReport,
    reports,
    attachments,
    handleFileChange,
    getFormArray,
    removeFormFile,
    saveReport
  } = databaseStore()

  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      await initializeDB();
      createDB();
      fetchReport();
    })()
  }, []);

  return (
    <>
      <div className="font-bold text-xl my-3">offline app</div>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={() => {
          // 업로드 시작
          fileInputRef.current.click();
        }} className="test-button">파일 선택</button>
      </div>

      <div className="flex flex-col gap-4">
        {
          (() => {
            //for (let [key, value] of formData.entries()) {
            return getFormArray().map(([key, value]) => {
              return (
                <div className="flex justify-between mx-4 p-2 bg-yellow-200" key={key}>
                  <div className="">
                    {key} - <span className="font-bold">{value.name}</span>
                  </div>
                  <button
                    onClick={(() => {
                      removeFormFile(key)
                    })}
                    className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                    <span className="text-lg font-bold">X</span>
                  </button>
                </div>
              )
            })
          })()
        }
      </div>

      <button onClick={saveReport} className="test-button" key={uuidv4()}>Save</button>

      <h2 className="text-lg font-bold mt-4">Reports</h2>
      <div className="my-4">
        {
          (() => {
            return reports.map((element, index) => {
              return (
                <div key={index}>
                  id: {element.id}, category: {element.category}, report_id: {element.report_id}, attachment: {element.attachment}
                </div>
              )
            })
          })()
        }
      </div>

      <h2 className="text-lg font-bold">Attachment</h2>
      <div className="my-4">
        {
          (() => {
            return attachments.map((element, index) => {
              return (
                <div key={index}>
                  id: {element.id}, report_id: {element.report_id}, filename: {element.filename}
                </div>
              )
            })
          })()
        }
      </div>
    </>
  )
}
export default OffLineRefactoring;