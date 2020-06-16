import ACCESS_CONFIG from '../config/config';
import DTableWebAPI from '../src/dtable-web-api';

let { server, username, password } = ACCESS_CONFIG;
let dtableWebAPI = new DTableWebAPI();
dtableWebAPI.init({server, username, password});

beforeEach(() => {
  return dtableWebAPI.login();
});

// has been deleted 
// test("listDir", () => {
//   return dtableWebAPI.listDir(repoID, dirPath).then((response) => {
//     expect(response.data).not.toBe(null);
//   });
// });

// has been deleted 
// test("listRepos", () => {
//   return dtableWebAPI.listRepos().then((response) => {
//     expect(response.data).not.toBe(null);
//   });
// });
    
// has been deleted 
// test("getFileInfo", () => {
//   return dtableWebAPI.getFileInfo(repoID, filePath).then((response) => {
//     expect(response.data).not.toBe(null);
//   });
// })

// has been deleted
// test("getInternalLink", () => {
//   return dtableWebAPI.getInternalLink(repoID, filePath, direntType).then((response) => {
//     expect(response.data).not.toBe(null);
//   });
// })

test("listWorksapces", () => {
  return dtableWebAPI.listWorkspaces().then(response => {
    expect(response.data).not.toBe(null);
  })
});

test("listSharedTables", () => {
  return dtableWebAPI.listSharedTables().then(response => {
    expect(response.data).not.toBe(null);
  })
});

test("createTable", () => {
  let tableName = "Test create table";
  let owner = username;
  return dtableWebAPI.createTable(tableName, owner).then(response => {
    expect(response.data).not.toBe(null);
  }).catch(error => {
    console.log(error.response.data);
  })
});
