import axios from 'axios';
import FormData from 'form-data';

class DTableWebAPI {
  
  init({server, username, password, token}) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;
    if (this.token && this.server) {
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    }
    return this;
  }

  initForDTableUsage({ siteRoot, xcsrfHeaders }) {
    if (siteRoot && siteRoot.charAt(siteRoot.length-1) === '/') {
      var server = siteRoot.substring(0, siteRoot.length-1);
      this.server = server;
    } else {
      this.server = siteRoot;
    } 

    this.req = axios.create({
      headers: {
        'X-CSRFToken': xcsrfHeaders,
      }
    });
    return this;
  }

  login() {
    const url = this.server + '/api2/auth-token/';
    return axios.post(url, {
      username: this.username,
      password: this.password
    }).then((response) => {
      this.token = response.data.token;
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    });
  }

  _sendPostRequest(url, form) {
    if (form.getHeaders) {
      return this.req.post(url, form, {
        headers:form.getHeaders()
      });
    } else {
      return this.req.post(url, form);
    }
  }

  uploadImage (uploadLink, formData, onUploadProgress = null) {
    return (
      axios.create()({
        method: 'post',
        data: formData,
        url: uploadLink,
        onUploadProgress: onUploadProgress
      })
    );
  }

  // workspace api
  listWorkspaces(detail) {
    let url = this.server + '/api/v2.1/workspaces/';
    if (detail !== undefined) {
      url = url + '?detail=' + detail;
    }
    return this.req.get(url);
  }

  // share table api
  listSharedTables() {
    let url = this.server + '/api/v2.1/dtables/shared/';
    return this.req.get(url);
  }

  listGroupSharedTables() {
    let url = this.server + '/api/v2.1/dtables/group-shared/';
    return this.req.get(url);
  }
  
  // share view api
  listDTableUserViewShares(workspaceId, dtableName, tableId, viewId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/user-view-shares/';
    let params = '';
    if (tableId && viewId) {
      params = `?table_id=${tableId}&view_id=${viewId}`;
    }
    return this.req.get(url + params);
  }

  createDTableUserViewShare(workspaceId, dtableName, tableId, viewId, permission, toUser, sharedName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/user-view-shares/';
    let params = {
      table_id: tableId,
      view_id: viewId,
      permission: permission,
      to_user: toUser,
      shared_name: sharedName
    };
    return this.req.post(url, params);
  }

  updateDTableUserViewShare(workspaceId, dtableName, viewShareId, permission, sharedName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/user-view-shares/' + viewShareId + '/';
    let params = {
      permission: permission,
    };
    if (sharedName) {
      params['shared_name'] = sharedName;
    }
    return this.req.put(url, params);
  }

  deleteDTableUserViewShare(workspaceId, dtableName, viewShareId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/user-view-shares/' + viewShareId + '/';
    return this.req.delete(url);
  }

  deleteDTableUserViewShareByViewId(workspaceId, dtableName, tableId, viewId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/user-view-shares/';
    let params = `?table_id=${tableId}&view_id=${viewId}`;
    return this.req.delete(url + params);
  }

  listDTableGroupViewShares(workspaceId, dtableName, tableId, viewId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/group-view-shares/';
    let params = '';
    if (tableId && viewId) {
      params = `?table_id=${tableId}&view_id=${viewId}`;
    }
    return this.req.get(url + params);
  }

  createDTableGroupViewShare(workspaceId, dtableName, tableId, viewId, permission, toGroupId, sharedName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/group-view-shares/';
    let params = {
      table_id: tableId,
      view_id: viewId,
      permission: permission,
      to_group_id: toGroupId,
      shared_name: sharedName
    };
    return this.req.post(url, params);
  }

  updateDTableGroupViewShare(workspaceId, dtableName, viewShareId, permission, sharedName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/group-view-shares/' + viewShareId + '/';
    let params = {
      permission: permission,
    };
    if (sharedName) {
      params['shared_name'] = sharedName;
    }
    return this.req.put(url, params);
  }

  deleteDTableGroupViewShare(workspaceId, dtableName, viewShareId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/group-view-shares/' + viewShareId + '/';
    return this.req.delete(url);
  }

  deleteDTableGroupViewShareByViewId(workspaceId, dtableName, tableId, viewId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/group-view-shares/';
    let params = `?table_id=${tableId}&view_id=${viewId}`;
    return this.req.delete(url + params);
  }

  listSharedViews() {
    let url = this.server + '/api/v2.1/dtables/view-shares-user-shared/';
    return this.req.get(url);
  }

  leaveViewShare(viewShareId) {
    let url = this.server + '/api/v2.1/dtables/view-shares-user-shared/' + viewShareId + '/';
    return this.req.delete(url);
  }

  listGroupSharedViews() {
    let url = this.server + '/api/v2.1/dtables/view-shares-group-shared/';
    return this.req.get(url);
  }

  leaveGroupViewShare(viewShareId) {
    let url = this.server + '/api/v2.1/dtables/view-shares-group-shared/' + viewShareId + '/';
    return this.req.delete(url);
  }

  // ---- dTable api
  createTable(name, owner, dtableIcon, dtableColor, textColor, folderID) {
    const url = this.server + '/api/v2.1/dtables/';
    let form = new FormData();
    form.append('name', name);
    form.append('owner', owner);
    if (dtableColor) {
      form.append('color', dtableColor);
    }
    if (dtableIcon) {
      form.append('icon', dtableIcon);
    }
    if (textColor) {
      form.append('text_color', textColor);
    }
    if (folderID) {
      form.append('folder_id', folderID);
    }
    return this._sendPostRequest(url, form);
  }

  renameTable(workspaceID, old_name, new_name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
    let form = new FormData();
    form.append('name', old_name);
    form.append('new_name', new_name);
    return this.req.put(url, form);
  }

  updateTable(workspaceID, table_name, updates) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
    let form = new FormData();
    form.append('name', table_name);
    if (updates.color) {
      form.append('color', updates.color);
    }
    if (updates.new_name) {
      form.append('new_name', updates.new_name);
    }
    if (updates.text_color) {
      form.append('text_color', updates.text_color);
    }
    if (updates.icon) {
      form.append('icon', updates.icon);
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'password')) {
      form.append('password', updates.password);
    }
    return this.req.put(url, form);
  }

  updateDTablePassword(workspaceID, dtableName, operation, password, new_password, code) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/password/';
    let form = new FormData();
    form.append('operation', operation);
    if (new_password) {
      form.append('new_password', new_password);
    }
    if (password) {
      form.append('password', password);
    }
    if (code) {
      form.append('code', code);
    }
    return this.req.put(url, form);
  }

  deleteTable(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
    let params = { name: name };
    return this.req.delete(url, { data: params });
  }

  listTableShares(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
    return this.req.get(url);
  }

  addTableShare(workspaceID, name, email, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
    let params = {
      email: email,
      permission: permission
    };
    return this.req.post(url, params);
  }

  deleteTableShare(workspaceID, name, email) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
    let params = { email: email };
    return this.req.delete(url, { data: params });
  }

  updateTableShare(workspaceID, name, email, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
    let params = {
      email: email,
      permission: permission
    };
    return this.req.put(url, params);
  }

  listTableGroupShares(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/group-shares/';
    return this.req.get(url);
  }

  addTableGroupShare(workspaceID, name, groupID, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/group-shares/';
    let params = {
      group_id: groupID,
      permission: permission
    };
    return this.req.post(url, params);
  }

  deleteTableGroupShare(workspaceID, name, groupID) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/group-shares/' + groupID + '/';
    return this.req.delete(url);
  }

  updateTableGroupShare(workspaceID, name, groupID, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/group-shares/' + groupID + '/';
    let params = {
      permission: permission
    };
    return this.req.put(url, params);
  }

  getDTableInviteLink(workspaceID, name) {
    var url = this.server + '/api/v2.1/dtables/invite-links/?workspace_id=' + workspaceID + '&table_name=' + encodeURIComponent(name);
    return this.req.get(url);
  }

  createDTableInviteLink(workspaceID, name, permission, password, expire_days) {
    let url = this.server + '/api/v2.1/dtables/invite-links/';
    let form = new FormData();
    form.append('workspace_id', workspaceID);
    form.append('table_name', name);

    if (permission) {
      form.append('permission', permission);
    }

    if (password) {
      form.append('password', password);
    }

    if (expire_days) {
      form.append('expire_days', expire_days);
    }

    return this._sendPostRequest(url, form);
  }

  deleteDTableInviteLink(token) {
    var url = this.server + '/api/v2.1/dtables/invite-links/' + token + '/';
    return this.req.delete(url);
  }

  getDTableExternalLink(workspaceID, name) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/external-links/';
    return this.req.get(url);
  }

  createDTableExternalLink(workspaceID, name, token, password, expireDays) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/external-links/';
    let form = new FormData();
    if (token) {
      form.append('token', token);
    }
    if (password) {
      form.append('password', password);
    }
    if (expireDays) {
      form.append('expire_days', expireDays);
    }
    return this._sendPostRequest(url, form);
  }
  
  deleteDTableExternalLink(workspaceID, name, token) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/external-links/' + token + '/';
    return this.req.delete(url);
  }

  listDTableViewExternalLinks(workspaceID, name, tableId, viewId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/view-external-links/';
    url += '?table_id=' + tableId + '&view_id=' + viewId;
    return this.req.get(url);
  }

  createDTableViewExternalLink(workspaceID, name, tableId, viewId, token, password, expireDays) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/view-external-links/';
    let form = new FormData();
    form.append('table_id', tableId);
    form.append('view_id', viewId);
    if (token) {
      form.append('token', token);
    }
    if (password) {
      form.append('password', password);
    }
    if (expireDays) {
      form.append('expire_days', expireDays);
    }
    return this._sendPostRequest(url, form);
  }
  
  deleteDTableViewExternalLink(workspaceID, name, token) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) +'/view-external-links/' + token + '/';
    return this.req.delete(url);
  }

  getTableAccessTokenByViewExternalLink(token) {
    const url = this.server + '/api/v2.1/view-external-link-tokens/' + token + '/access-token/';
    return this.req.get(url);
  }
  
  listTableAPITokens(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/';
    return this.req.get(url);
  }

  addTableAPIToken(workspaceID, name, appName, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/';
    let params = {
      app_name: appName,
      permission: permission
    };
    return this.req.post(url, params);
  }

  updateTableAPIToken(workspaceID, name, appName, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/' + encodeURIComponent(appName) + '/';
    let params = {
      permission: permission
    };
    return this.req.put(url, params);
  }

  deleteTableAPIToken(workspaceID, name, appName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/' + encodeURIComponent(appName) + '/';
    return this.req.delete(url);
  }

  getDTableTempAPIToken(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/temp-api-token/';
    return this.req.get(url);
  }

  copyDTable(srcWorkspaceID, dstWorkspaceID, name, password) {
    let url = this.server + '/api/v2.1/dtable-copy/';
    let formData = new FormData();
    formData.append('src_workspace_id', srcWorkspaceID);
    formData.append('dst_workspace_id', dstWorkspaceID);
    formData.append('name', name);
    if (password) {
      formData.append('password', password);
    }
    return this._sendPostRequest(url, formData);
  }

  copyExternalDtable(dstWorkspaceID, link, folderID) {
    let url = this.server + '/api/v2.1/dtable-external-link/dtable-copy/';
    let formData = new FormData();
    formData.append('link', link);
    formData.append('dst_workspace_id', dstWorkspaceID);
    if (folderID) {
      formData.append('folder_id', folderID);
    }
    return this._sendPostRequest(url, formData);
  }

  addExportExternalDTable(externalLinkToken, onDownloadProgress = null) {
    let url = this.server + '/dtable/external-links/'+ externalLinkToken +'/download-zip/';
    const _this = this;
    return this.req.get(url, {onDownloadProgress, responseType: 'blob', cancelToken: new axios.CancelToken(function executor(c) {
      _this.source = c;
    })});
  }

  cancelRequest() {
    return this.source();
  }

  addExportDTableTask(workspaceId, dtable_name, password) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtable_name) + '/export-dtable/';
    let formData = new FormData();
    if (password) {
      formData.append('password', password);
    }

    return this._sendPostRequest(url, formData);
  }

  addImportDTableTask (workspaceId, file, folderID) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-dtable/';
    let formData = new FormData();
    formData.append('dtable', file);
    if (folderID) {
      formData.append('folder_id', folderID);
    }
    return this._sendPostRequest(url, formData);
  }

  appendExcelCSVUploadFile(workspaceId, file, dtableUuid, tableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/append-excel-csv/upload-file/';
    let formData = new FormData();
    formData.append('file', file);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    return this._sendPostRequest(url, formData);
  }

  appendExcelCSVAppendParsedFile(workspaceId, fileName, dtableUuid, tableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/append-excel-csv/append-parsed-file/';
    let formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    return this._sendPostRequest(url, formData);
  }

  excelCommonGetParsedFile(workspaceId, fileName, dtableUuid) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/excel-common/get-parsed-file/?file_name=' + encodeURIComponent(fileName) + '&dtable_uuid=' + dtableUuid;
    return this.req.get(url);
  }

  queryDTableIOStatusByTaskId(taskId) {
    let url = this.server + '/api/v2.1/dtable-io-status/?task_id=' + taskId;
    return this.req.get(url);
  }

  cancelDTableIOTask(taskId, dtable_uuid, task_type) {
    let url = this.server + '/api/v2.1/dtable-io-status/';
    let params = {
      task_id: taskId,
      dtable_uuid: dtable_uuid,
      task_type: task_type
    };
    return this.req.delete(url, {params: params});
  }

  importExcelCSVPreview(workspaceId, dtableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/?dtable_name=' + encodeURIComponent(dtableName);
    return this.req.get(url);
  }

  importExcelCSVCancel(workspaceId, dtableName, fileType) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/?dtable_name=' + encodeURIComponent(dtableName) + '&file_type=' + fileType;
    return this.req.delete(url);
  }

  addImportExcelCSVTask(workspaceId, dtableName, folderID) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/';
    let formData = new FormData();
    formData.append('dtable_name', dtableName);
    if (folderID) {
      formData.append('folder_id', folderID);
    }
    return this.req.post(url, formData);
  }

  importExcelCSVUploadFile(workspaceId, file, dtableUuid) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/upload-file/';
    let formData = new FormData();
    formData.append('file', file);
    formData.append('dtable_uuid', dtableUuid);
    return this.req.post(url, formData);
  }

  importExcelCSVImportParsedFile(workspaceId, fileName, dtableUuid, tableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/import-parsed-file/';
    let formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    return this._sendPostRequest(url, formData);
  }

  excelCommonDeleteExcel(workspaceId, fileName, dtableUuid) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/excel-common/delete-excel/?file_name=' + encodeURIComponent(fileName) + '&dtable_uuid=' + dtableUuid;
    return this.req.delete(url);
  }

  updateExcelUploadExcel(workspaceId, file, dtableUuid, tableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/update-excel/upload-excel/';
    let formData = new FormData();
    formData.append('file', file);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    return this._sendPostRequest(url, formData);
  }

  updateExcelCSVUpdateParsedFile(workspaceId, fileName, dtableUuid, tableName, selectedColumns) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/update-excel-csv/update-parsed-file/';
    let formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    formData.append('selected_columns', selectedColumns);
    return this._sendPostRequest(url, formData);
  }

  updateExcelCSVGetCheckedResult(workspaceId, fileName, dtableUuid, tableName, selectedColumns) {
    let params = 'file_name=' + encodeURIComponent(fileName) + '&dtable_uuid=' + dtableUuid + '&table_name='
          + encodeURIComponent(tableName) + '&selected_columns=' + encodeURIComponent(selectedColumns);
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/update-excel-csv/get-checked-result/?' + params;
    return this.req.get(url);
  }

  updateCSVUploadCSV(workspaceId, file, dtableUuid, tableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/update-csv/upload-csv/';
    let formData = new FormData();
    formData.append('file', file);
    formData.append('dtable_uuid', dtableUuid);
    formData.append('table_name', tableName);
    return this._sendPostRequest(url, formData);
  }

  CSVCommonDeleteCSV(workspaceId, fileName, dtableUuid) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/csv-common/delete-csv/?file_name=' + fileName + '&dtable_uuid=' + dtableUuid;
    return this.req.delete(url);
  }

  addUpdateExcelCSVTask(workspaceId, dtableName, tables) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-excel-csv/';
    let formData = new FormData();
    formData.append('dtable_name', dtableName);
    formData.append('tables', tables);
    return this.req.put(url, formData);
  }

  addConvertPageTask(workspaceId, dtableName, params) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/convert-page/';
    return this.req.get(url, { params: params });
  }

  convertViewToExcel(workspaceId, fileName, tableId, viewId) {
    let params = 'table_id=' + tableId + '&view_id=' + viewId;
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(fileName) + '/convert-view-to-excel/?' + params;
    return this.req.get(url);
  }

  convertTableToExcel(workspaceId, fileName, tableId) {
    let params = 'table_id=' + tableId;
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(fileName) + '/convert-table-to-excel/?' + params;
    return this.req.get(url);
  }

  createSeafileConnector(dtableId, seafileURL, repoAPIToken) {
    let url = this.server + '/api/v2.1/seafile-connectors/';
    let formData = new FormData();
    formData.append('dtable_id', dtableId);
    formData.append('seafile_url', seafileURL );
    formData.append('repo_api_token', repoAPIToken);
    return this.req.post(url, formData);
  }

  updateSeafileConnector(dtableId, seafileURL, repoAPIToken, connectorId) {
    let url = this.server + '/api/v2.1/seafile-connectors/' + connectorId + '/';
    let formData = new FormData();
    formData.append('dtable_id', dtableId);
    formData.append('seafile_url', seafileURL );
    formData.append('repo_api_token', repoAPIToken);
    return this.req.put(url, formData);
  }

  addStarDTable(dtable_uuid) {
    let url = this.server + '/api/v2.1/starred-dtables/';
    let formData = new FormData();
    formData.append('dtable_uuid', dtable_uuid);
    return this.req.post(url, formData);
  }

  addAbuseReport(external_link_token, reporter, abuse_type, description) {
    let url = this.server + '/api/v2.1/abuse-reports/';
    let formData = new FormData();
    formData.append('external_link_token', external_link_token);
    formData.append('reporter', reporter);
    formData.append('abuse_type', abuse_type);
    formData.append('description', description);
    return this.req.post(url, formData);
  }

  unstarDTable(dtable_uuid) {
    let url = this.server + '/api/v2.1/starred-dtables/?dtable_uuid=' + dtable_uuid;
    return this.req.delete(url);
  }

  getDTableWebhooks(workspaceID, name) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/webhooks/';
    return this.req.get(url);
  }

  createDTableWebhook(workspaceID, name, hookURL, secret) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/webhooks/';
    let form = new FormData();
    form.append('url', hookURL);
    if (secret) {
      form.append('secret', secret);
    }
    return this._sendPostRequest(url, form);
  }

  deleteDTableWebhook(workspaceID, name, webhookID) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/webhooks/' + webhookID + '/';
    return this.req.delete(url);
  }

  updateDTableWebhook(workspaceID, name, webhookID, updates) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/webhooks/' + webhookID + '/';
    let form = new FormData();
    if (updates.url) {
      form.append('url', updates.url);
    }
    if (updates.secret) {
      form.append('secret', updates.secret);
    }
    return this.req.put(url, form);
  }

  listCollectionTables() {
    let url = this.server + '/api/v2.1/collection-tables/';
    return this.req.get(url);
  }

  listDTableCollectionTables(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/collection-tables/?workspace_id=' + workspaceID + '&name='+ encodeURIComponent(dtableName);
    return this.req.get(url);
  }

  createDTableCollectionTable(workspaceID, dtableName, config) {
    let url = this.server + '/api/v2.1/collection-tables/';
    let formData = new FormData();
    formData.append('workspace_id', workspaceID);
    formData.append('name', dtableName);
    formData.append('config', config);
    return this._sendPostRequest(url, formData);
  }

  updateDTableCollectionTable(token, config) {
    let url = this.server + '/api/v2.1/collection-tables/' + token + '/';
    let formData = new FormData();
    formData.append('config', config);
    return this.req.put(url, formData);
  }

  deleteDTableCollectionTable(token) {
    let url = this.server + '/api/v2.1/collection-tables/' + token + '/';
    return this.req.delete(url);
  }

  getTableAccessTokenByCollectionTableToken(token) {
    let url = this.server + '/api/v2.1/collection-tables/access-token/' + '?token=' + token;
    return this.req.get(url);
  }

  listForms() {
    let url = this.server + '/api/v2.1/forms/';
    return this.req.get(url);
  }

  listSharedForms() {
    let url = this.server + '/api/v2.1/forms/shared/';
    return this.req.get(url);
  }

  listDTableForms(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/forms/?workspace_id=' + workspaceID + '&name='+ encodeURIComponent(dtableName);
    return this.req.get(url);
  }

  createDTableForm(workspaceID, dtableName, formID, formConfig) {
    let url = this.server + '/api/v2.1/forms/';
    let formData = new FormData();
    formData.append('workspace_id', workspaceID);
    formData.append('name', dtableName);
    formData.append('form_id', formID);
    formData.append('form_config', formConfig);
    return this._sendPostRequest(url, formData);
  }

  deleteDTableForm(token) {
    let url = this.server + '/api/v2.1/forms/' + token + '/';
    return this.req.delete(url);
  }

  updateDTableForm(token, formConfig) {
    let url = this.server + '/api/v2.1/forms/' + token + '/';
    let formData = new FormData();
    formData.append('form_config', formConfig);
    return this.req.put(url, formData);
  }

  dTableFormShare(token, shareType, groupIDs) {
    let url = this.server + '/api/v2.1/forms/' + token + '/share/';
    let params = {
      share_type: shareType,
      group_ids: groupIDs
    };
    return this.req.post(url, params);
  }

  duplicateDTableForm(token) {
    let url = this.server + '/api/v2.1/forms/' + token + '/duplicate/';
    return this.req.post(url);
  }

  duplicateDTableCollectionTable(token) {
    let url = this.server + '/api/v2.1/collection-tables/' + token + '/duplicate/';
    return this.req.post(url);
  }

  getPublicUploadLinkViaFormToken(token) {
    let url = this.server + '/api/v2.1/forms/' + token + '/public-upload-link/';
    return this.req.get(url);
  }

  getUploadLinkViaFormToken(token, uploadType) {
    let url = this.server + '/api/v2.1/forms/' + token + '/upload-link/';
    return this.req.get(url, { params: { upload_type: uploadType } });
  }

  getTableFormShareLink(workspaceID, dtableName, formId) {
    let params = 'workspace_id=' + workspaceID + '&name=' + encodeURIComponent(dtableName) + '&form_id=' + formId;
    let url = this.server + '/api/v2.1/dtable-form-links/?' + params;
    return this.req.get(url);
  }

  createTableFormShareLink(workspaceID, dtableName, formId) {
    let url = this.server + '/api/v2.1/dtable-form-links/';
    let form = new FormData();
    form.append('workspace_id', workspaceID);
    form.append('name', dtableName);
    form.append('form_id', formId);

    return this._sendPostRequest(url, form);
  }

  deleteTableFormShareLink(token) {
    let url = this.server + '/api/v2.1/dtable-form-links/' + token + '/';
    return this.req.delete(url);
  }

  submitFormData(token, table_id, row_data, link_data) {
    const url = this.server + '/api/v2.1/form-submit/' + token + '/';
    let form = new FormData();
    form.append('table_id', table_id);
    form.append('row_data', row_data);
    if (link_data) {
      form.append('link_data', link_data);
    }
    return this._sendPostRequest(url, form);
  }

  getActivitiesDetail(dtable_uuid, opDate, pageNum, avatarSize=36) {
    let params = 'dtable_uuid=' + dtable_uuid + '&op_date=' + opDate + '&page=' + pageNum + '&avatar_size=' + avatarSize;
    let url = this.server + '/api/v2.1/dtable-activities/detail/?' + params;
    return this.req.get(url);
  }

  getDTableActivities(pageNum) {
    let url = this.server + '/api/v2.1/dtable-activities/?page=' + pageNum;
    return this.req.get(url);
  }

  listDTableSnapshots(workspaceID, dtableName, page, perPage) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/'+ encodeURIComponent(dtableName) + '/snapshots/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  getDTableSnapshotDownloadLink(workspaceID, dtableName, commitId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/snapshots/' + commitId + '/';
    return this.req.get(url);
  }

  restoreDTableSnapshot(workspaceID, dtableName, commitId, snapshotName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/snapshots/' + commitId + '/restore/';
    let form = new FormData();
    form.append('snapshot_name', snapshotName);
    return this._sendPostRequest(url, form);
  }

  listTrashDTables(page, perPage){
    let url = this.server + '/api/v2.1/trash-dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  cleanTrashDTables() {
    let url = this.server + '/api/v2.1/trash-dtables/';
    return this.req.delete(url);
  }

  restoreTrashDTable(dtableID){
    let url = this.server + '/api/v2.1/trash-dtables/' + dtableID + '/';
    return this.req.put(url);
  }

  createFolder(workspaceID, name) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/folders/';
    let form = new FormData();
    form.append('name', name);
    return this._sendPostRequest(url, form);
  }

  updateFolder(workspaceID, folderID, name) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/folders/' + folderID + '/';
    let form = new FormData();
    form.append('name', name);
    return this.req.put(url, form);
  }

  deleteFolder(workspaceID, folderID) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/folders/' + folderID +'/';
    return this.req.delete(url);
  }

  moveFolderItem(workspaceID, itemType, itemID, moveFrom, moveTo) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/folder-item-moving/';
    let form = new FormData();
    form.append('item_type', itemType);
    form.append('item_id', itemID);
    form.append('from', moveFrom);
    form.append('to', moveTo);
    return this._sendPostRequest(url, form);
  }

  // dtable plugin module
  listAvailablePlugins() {
    let url = this.server + '/api/v2.1/dtable-system-plugins/';
    return this.req.get(url);
  }

  listActivatedPlugins(pluginNames) {
    let url = this.server + '/api/v2.1/dtable-plugins/';
    let params = '?';
    if (pluginNames) {
      if (!Array.isArray(pluginNames)) {
        params = params + 'plugin_name=' + pluginNames;
      } else {
        let pluginName = pluginNames.shift();
        params = params + 'plugin_name=' + pluginName;

        for(let i = 0; i < pluginNames.length; i++) {
          params = params + '&plugin_name=' + pluginNames[i];
        }
      }
    }
    return this.req.get(url + params);
  }
  
  updatePluginState(pluginId, dtableUuid, enable) {
    let url = this.server + '/api/v2.1/dtable-plugins/' + pluginId + '/';
    let form = new FormData();
    form.append('dtable_uuid', dtableUuid);
    form.append('is_enable', enable);
    return this._sendPostRequest(url, form);
  }

  countPluginInstall(pluginName) {
    let url = this.server + '/api/v2.1/dtables/plugins-install-count/';
    let form = new FormData();
    form.append('plugin_name', pluginName);
    return this._sendPostRequest(url, form);
  }

  // external app module
  listExternalAppsInstances(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/external-apps/';
    return this.req.get(url);
  }
  
  createExternalAppInstance(workspaceID, dtableName, appType, appConfig) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/external-apps/';
    let form = new FormData();
    form.append('app_type', appType);
    form.append('app_config', appConfig);
    return this.req.post(url, form);
  }
  
  deleteExternalAppInstance(workspaceID, dtableName, externalAppId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/external-apps/' + externalAppId + '/';
    return this.req.delete(url);
  }

  updateExternalAppInstance(workspaceID, dtableName, externalAppId, appConfig) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/external-apps/' + externalAppId + '/';
    let form = new FormData();
    form.append('app_config', appConfig);
    return this.req.put(url, form);
  }

  listUserApps() {
    let url = this.server + '/api/v2.1/universal-apps/';
    return this.req.get(url);
  }

  leaveApp(appUserId) {
    let url = this.server + '/api/v2.1/app-users/' + appUserId + '/';
    return this.req.delete(url);
  }

  listAppUsers(token, page, perPage) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  addAppUsersBatch(token, usersInfo) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/batch/';
    let data = {'users_info': usersInfo};
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  updateAppUser(token, app_user_id, is_active) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/' + app_user_id + '/';
    let data = {
      'is_active': is_active
    };
    return this.req.put(url, data, {headers: {'Content-Type': 'application/json'}});
  }
  
  deleteAppUser(token, app_user_id) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/' + app_user_id + '/';
    return this.req.delete(url);
  }

  getAppUserSyncInfo(token) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/sync/';
    return this.req.get(url);
  }

  syncAppUserInfo(token, table_name) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-users/sync/';
    let data = {};
    if (table_name){
      data['table_name'] = table_name;
    }

    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  listAppRoles(token) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-roles/';
    return this.req.get(url);
  }

  addAppRoles(token, role_name, permission, permission_detail) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-roles/';
    let data = {
      'role_name': role_name,
      'permission': permission,
    };
    if (permission_detail){
      data['permission_detail'] = permission_detail;
    }
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  getAppRole(token, app_role_id) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-roles/' + app_role_id + '/';
    return this.req.get(url);
  }

  updateAppRole(token, app_role_id, role_name, permission, permission_detail) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-roles/' + app_role_id + '/';
    let data = {
      'role_name': role_name,
      'permission': permission,
    };
    if (permission_detail){
      data['permission_detail'] = permission_detail;
    }
    return this.req.put(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  deleteAppRole(token, app_role_id) {
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/app-roles/' + app_role_id + '/';
    return this.req.delete(url);
  }


  listAppInviteLinks(token){
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/invite-links/';
    return this.req.get(url);
  }

  addAppInviteLinks(token, role_name, password, expire_days){
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/invite-links/';
    let form = new FormData();
    if (role_name) {
      form.append('role_name', role_name);
    }

    if (password) {
      form.append('password', password);
    }

    if (expire_days) {
      form.append('expire_days', expire_days);
    }

    return this._sendPostRequest(url, form);
  }

  deleteAppInviteLinks(token, link_token){
    let url = this.server + '/api/v2.1/universal-apps/' + token + '/invite-links/' + link_token + '/';
    return this.req.delete(url);
  }

  submitExternalAppFormData(token, app_page_id, row_data, table_name) {
    let url = this.server + '/api/v2.1/external-app-form-submit/' + token + '/';
    let form = new FormData();
    form.append('app_page_id', app_page_id);
    form.append('row_data', row_data);
    form.append('table_name', table_name);
    return this._sendPostRequest(url, form);
  }

  getExternalAppUploadLink(token) {
    let url = this.server + '/api/v2.1/external-apps/' + token + '/upload-link/';
    return this.req.get(url);
  }

  pluginEmailSendEmail(dtableUuid, thirdAccountName, emailInfo, tableInfo) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/plugin-email-send-email/`;
    let data = {
      'account_name': thirdAccountName,
      'email_info': emailInfo,
      'table_info': tableInfo
    };
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  getPluginEmailSendStatus(task_id) {
    const url = this.server + '/api/v2.1/plugin-email-send-status/?task_id=' + task_id;
    return this.req.get(url);
  }

  addEmailSendTask(dtableUuid, account_name, send_to, message, subject, copy_to, reply_to, attachments, html_message, need_message_id, in_reply_to) {
    let url = this.server + '/api/v2.1/dtable-message/' + dtableUuid + '/email/';
    let data = {
      'account_name': account_name,
      'send_to': send_to,
      'message': message,
      'subject': subject,
    };
    if (copy_to) {
      data['copy_to'] = copy_to;
    }
    if (reply_to) {
      data['reply_to'] = reply_to;
    }
    if (attachments) {
      data['attachments'] = attachments;
    }
    if (html_message) {
      data['html_message'] = html_message;
    }
    if (need_message_id) {
      data['need_message_id'] = need_message_id;
    }
    if (in_reply_to) {
      data['in_reply_to'] = in_reply_to;
    }
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  addWechatSendTask(dtableUuid, account_name, message, msg_type) {
    let url = this.server + '/api/v2.1/dtable-message/' + dtableUuid + '/wechat/';
    let data = {
      'message': message,
      'account_name': account_name,
      'msg_type': msg_type,
    };

    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  addDingtalkSendTask(dtableUuid, account_name, message) {
    let url = this.server + '/api/v2.1/dtable-message/' + dtableUuid + '/dingtalk/';
    let data = {
      'message': message,
      'account_name': account_name,
    };

    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }


  getMessageSendStatus(task_id) {
    const url = this.server + '/api/v2.1/dtable-message-status/?task_id=' + task_id;
    return this.req.get(url);
  }

  deleteMessageSendTask(task_id) {
    const url = this.server + '/api/v2.1/dtable-message-status/?task_id=' + task_id;
    return this.req.delete(url);
  }

  
  // ---- dtable data api
  getTableDownloadLink(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/?name=' + encodeURIComponent(name) + '&reuse=1';
    return this.req.get(url);
  }

  getTableUpdateLink(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable-update-link/?name=' + encodeURIComponent(name);
    return this.req.get(url);
  }

  getTableAccessToken(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/access-token/';
    return this.req.get(url);
  }

  getTableAccessTokenByUserViewShare(workspaceID, name, viewShareId) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/user-view-share-access-token/?user_view_share_id=' + viewShareId;
    return this.req.get(url);
  }

  getTableAccessTokenByGroupViewShare(workspaceID, name, viewShareId) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/group-view-share-access-token/?group_view_share_id=' + viewShareId;
    return this.req.get(url);
  }

  getTableAccessTokenByShareLink(token) {
    const url = this.server + '/api/v2.1/dtable/share-link-access-token/' + '?token=' + token;
    return this.req.get(url);
  }

  getTableAccessTokenByExternalLink(token) {
    const url = this.server + '/api/v2.1/external-link-tokens/' + token + '/access-token/';
    return this.req.get(url);
  }

  getTableRelatedUsers(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/related-users/';
    return this.req.get(url);
  }

  getTableAssetUploadLink(workspaceID, name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable-asset-upload-link/?name=' + encodeURIComponent(name);
    return this.req.get(url);
  }

  isDTableAssetExist (workspaceID, tableName, path) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + tableName + '/asset-exists/?path=' + path;
    return this.req.get(url);
  }

  getTableRowShareLink(workspaceID, tableName, table_id, rowId) {
    let params = '?workspace_id=' + workspaceID + '&name=' + encodeURIComponent(tableName) + '&table_id=' + table_id + '&row_id=' + rowId; 
    const url = this.server + '/api/v2.1/dtable-row-shares/' + params;
    return this.req.get(url); 
  }

  createTableRowShareLink(workspaceID, tableName, table_id, rowId) {
    const url = this.server + '/api/v2.1/dtable-row-shares/';
    let form = new FormData();
    form.append('workspace_id', workspaceID);
    form.append('name', tableName);
    form.append('table_id', table_id);
    form.append('row_id', rowId);
    return this._sendPostRequest(url, form);
  }
  
  deleteTableRowShareLink(token) {
    const url = this.server + '/api/v2.1/dtable-row-shares/' + token + '/';
    this.req.delete(url);
  }

  listRecentAddedFiles(days) {
    let url =  this.server + '/api/v2.1/recent-added-files/';
    if (days) {
      url = url + '?days=' + days;
    }
    return this.req.get(url);
  }

  rotateImage(workspaceID, name, path, angle) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + name + '/rotate-image/';
    let form = new FormData();
    form.append('path', path);
    form.append('angle', angle);
    return this._sendPostRequest(url, form);
  }

  recognizeImage(dtableUuid, account_name, image_path, top_num = 2) {
    let url = this.server + '/api/v2.1/dtable/' + dtableUuid + '/image-recognition/';
    let data = {
      'account_name': account_name,
      'image_path': image_path,
      'top_num': top_num,
    };
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  getThirdPartyAccountsDetail(dtableUuid, account_name) {
    let url = this.server + '/api/v2.1/third-party-accounts/' + dtableUuid + '/detail/?account_name=' + encodeURIComponent(account_name);
    return this.req.get(url);
  }

  listThirdPartyAccounts(dtableUuid) {
    let url = this.server + '/api/v2.1/third-party-accounts/' + dtableUuid + '/';
    return this.req.get(url);
  }

  addThirdPartyAccount(dtableUuid, account_name, accout_type, detail) {
    let url = this.server + '/api/v2.1/third-party-accounts/' + dtableUuid + '/';
    let data = {
      'account_name': account_name,
      'account_type': accout_type,
      'detail': detail
    };
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  updateThirdPartyAccount(dtableUuid, account_id, account_name, account_type, detail) {
    let url = this.server + '/api/v2.1/third-party-accounts/' + dtableUuid + '/' + account_id + '/';
    let data = {
      'account_name': account_name,
      'account_type': account_type,
      'detail': detail
    };
    return this.req.put(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  deleteThirdPartyAccount(dtableUuid, account_id) {
    let url = this.server + '/api/v2.1/third-party-accounts/' + dtableUuid + '/' + account_id + '/';
    return this.req.delete(url);
  }

  savePageDesignPDFToFileColumn(workspaceID, dtableName, { page_id, row_id, target_table, target_row_id, target_column, file_name }) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID +'/dtable/' + dtableName + '/page-design-file/';
    let formData = new FormData();
    formData.append('page_id', page_id);
    formData.append('row_id', row_id);
    formData.append('target_table', target_table);
    formData.append('target_row_id', target_row_id);
    formData.append('target_column', target_column);
    formData.append('file_name', file_name);
    return this._sendPostRequest(url, formData);
  }

  listUserAdminDTables() {
    let url = this.server + '/api/v2.1/user-admin-dtables/';
    return this.req.get(url);
  }

  getDTableMetadata(dtableUuid) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/metadata/`;
    return this.req.get(url);
  }

  // data-sync apis
  listDataSyncJobs() {
    let url = this.server + '/api/v2.1/data-sync/user-jobs/';
    return this.req.get(url);
  }

  addDataSyncJob(dtableUuid, name, jobType, detail, minute, hour) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-sync/jobs/`;

    return this.req.post(url, {
      name: name,
      detail: detail,
      job_type: jobType,
      trigger_minute: minute,
      trigger_hour: hour
    });
  }

  updateDataSyncJob(dtableUuid, jobId, name, detail, minute, hour) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-sync/jobs/${jobId}/`;

    let options = {
      name: name,
      detail: detail,
      trigger_minute: minute,
      trigger_hour: hour
    };
    return this.req.put(url, options);
  }

  deleteDataSyncJob(dtableUuid, jobId) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-sync/jobs/${jobId}/`;
    return this.req.delete(url);
  }

  runDataSyncJob(dtableUuid, jobId, options) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-sync/jobs/${jobId}/run/`;
    return this.req.post(url, options);
  }

  queryDTableDataSyncStatusByTaskId(taskId) {
    let url = this.server + '/api/v2.1/dtable-data-sync-status/?task_id=' + taskId;
    return this.req.get(url);
  }

  addDataSync(dtableUuid, detail, syncType) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-syncs/`;
    return this.req.post(url, {
      detail: detail,
      sync_type: syncType
    });
  }

  listDataSyncs(dtableUuid, syncType) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-syncs/?sync_type=` + syncType;
    return this.req.get(url);
  }

  updateDataSync(dtableUuid, dataSyncId, syncType, detail) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-syncs/${dataSyncId}/`;
    let options = {
      detail: detail,
      sync_type: syncType
    };
    return this.req.put(url, options);
  }

  deleteDataSync(dtableUuid, dataSyncId) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-syncs/${dataSyncId}/`;
    return this.req.delete(url);
  }

  runDataSync(dtableUuid, dataSyncId, sendDate, syncType) {
    let url = this.server + `/api/v2.1/dtables/${dtableUuid}/data-syncs/${dataSyncId}/run/`;
    let options = {
      send_date: sendDate,
      sync_type: syncType
    };
    return this.req.post(url, options);
  }

  // workflow apis
  listWorkflows(workspaceId, baseName) {
    let url = this.server + '/api/v2.1/workflows/';
    return this.req.get(url, {
      params: {
        workspace_id: workspaceId,
        name: baseName
      }
    });
  }

  addWorkflow(workspaceId, baseName, workflowConfig) {
    let url = this.server + '/api/v2.1/workflows/';
    let form = new FormData();
    form.append('workspace_id', workspaceId);
    form.append('name', baseName);
    form.append('workflow_config', workflowConfig);
    return this._sendPostRequest(url, form);
  }

  getWorkflow(token) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/';
    return this.req.get(url);
  }

  updateWorkflow(token, workflowConfig) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/';
    let form = new FormData();
    form.append('workflow_config', workflowConfig);
    return this.req.put(url, form);
  }

  updateWorkflowProperties(token, updates) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/';
    let form = new FormData();
    if (updates.workflow_name) {
      form.append('workflow_name', updates.workflow_name);
    }
    if (updates.can_any_user_submit_via_link) {
      form.append('can_any_user_submit_via_link', updates.can_any_user_submit_via_link);
    }
    if (updates.icon) {
      form.append('icon', updates.icon);
    }
    if (updates.color) {
      form.append('color', updates.color);
    }
    return this.req.put(url, form);
  }

  deleteWorkflow(token) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/';
    return this.req.delete(url);
  }

  getWorkflowTaskByRowId(token, rowId) {
    const url = this.server + '/api/v2.1/workflows/' + token + '/task-row-id/' + rowId + '/';
    return this.req.get(url);
  }

  deleteWorkflowTaskByRowId(token, rowId) {
    const url = this.server + '/api/v2.1/workflows/' + token + '/task-row-id/' + rowId + '/';
    return this.req.delete(url);
  }

  deleteWorkflowTasksByRowIds(token, rowIds) {
    const url = this.server + '/api/v2.1/workflows/' + token + '/task-row-ids/';
    const params = {
      row_ids: rowIds
    };
    return this.req.delete(url, { data: params });
  }

  submitWorkflowTask(token, rowData, tableId, rowId, replace, link_rows, new_linked_rows) {
    let url = this.server + `/api/v2.1/workflows/${token}/task-submit/`;
    let form = new FormData();
    form.append('row_data', rowData);
    form.append('table_id', tableId);
    if (rowId) {
      form.append('row_id', rowId);
    }
    if (replace) {
      form.append('replace', 'true');
    }
    if (link_rows) {
      form.append('link_rows', link_rows);
    }
    if (new_linked_rows) {
      form.append('new_linked_rows', new_linked_rows);
    }
    return this._sendPostRequest(url, form);
  }

  transferWorkflowTask(token, taskId, rowData, nodeId, nextNodeId, link_rows, new_linked_rows) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/transfer/`;
    let form = new FormData();
    form.append('row_data', JSON.stringify(rowData));
    form.append('node_id', nodeId);
    if (nextNodeId) {
      form.append('next_node_id', nextNodeId);
    }
    if (link_rows) {
      form.append('link_rows', link_rows);
    }
    if (new_linked_rows) {
      form.append('new_linked_rows', new_linked_rows);
    }
    return this._sendPostRequest(url, form);
  }

  getLinkedTableRowsWithWorkflow(token, link_column_key, task_id) {
    let url = this.server + `/api/v2.1/workflows/${token}/linked-rows/`;
    let params = {
      link_column_key
    };
    if (task_id) {
      params.task_id = task_id;
    }
    return this.req.get(url, {
      params: params
    });
  }

  cancelWorkflowTask(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/cancel/`;
    return this.req.post(url);
  }

  getWorkflowTaskAdminView(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/admin-view/`;
    return this.req.get(url);
  }

  getWorkflowTaskParticipantView(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/participant-view/`;
    return this.req.get(url);
  }

  getWorkflowTaskInitiatorView(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/initiator-view/`;
    return this.req.get(url);
  }

  getWorkflowTaskParticipants(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/participants/`;
    return this.req.get(url);
  }

  updateWorkflowTaskParticipants(token, taskId, participants) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/participants/`;
    let form = new FormData();
    form.append('participants', participants.join(','));
    return this.req.put(url, form);
  }

  listSubmittedWorkflowTasks(page = null, perPage = null) {
    let url = this.server + '/api/v2.1/workflows/submitted-tasks/';
    let params = {
      page: page || 1,
      per_page: perPage || 25
    };
    return this.req.get(url, {
      params: params
    });
  }

  listHandledWorkflowTasks(page = null, perPage = null) {
    let url = this.server + '/api/v2.1/workflows/handled-tasks/';
    let params = {
      page: page || 1,
      per_page: perPage || 25
    };
    return this.req.get(url, {
      params: params
    });
  }

  listWorkflowOngoingTasks(page = null, perPage = null) {
    let url = this.server + '/api/v2.1/workflows/ongoing-tasks/';
    let params = {
      page: page || 1,
      per_page: perPage || 25
    };
    return this.req.get(url, {
      params: params
    });
  }

  deleteWorkflowTask(token, taskId) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/`;
    return this.req.delete(url);
  }

  listWorkflowShares(token) {
    let url = this.server + `/api/v2.1/workflows/${token}/shares/`;
    return this.req.get(url);
  }

  shareWorkflow(token, groupIdList) {
    let url = this.server + `/api/v2.1/workflows/${token}/shares/`;
    let form = new FormData();
    for (let i = 0; i < groupIdList.length; i++) {
      form.append('group_id', groupIdList[i]);
    }
    return this._sendPostRequest(url, form);
  }

  deleteWorkflowShare(token, groupId) {
    let url = this.server + `/api/v2.1/workflows/${token}/shares/${groupId}/`;
    return this.req.delete(url);
  }

  listSharedWorkflows() {
    let url = this.server + '/api/v2.1/workflows/shared/';
    return this.req.get(url);
  }

  getPublicUploadLinkViaWorkflowToken(token) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/public-upload-link/';
    return this.req.get(url);
  }

  getUploadLinkViaWorkflowToken(token, uploadType) {
    let url = this.server + '/api/v2.1/workflows/' + token + '/upload-link/';
    return this.req.get(url, { params: { upload_type: uploadType } });
  }

  getWorkflowInitForm(token) {
    const url = this.server + '/api/v2.1/workflows/' + token + '/init-form/';
    return this.req.get(url);
  }

  listWorkflowTaskLogs(token, taskId, page, perPage) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/${taskId}/logs/`;
    let params = {};
    if (page) {
      params.page = page;
    }
    if (perPage) {
      params.per_page = perPage;
    }
    return this.req.get(url, {
      params
    });
  }

  listWorkflowTasksByType(token, filterType, page, perPage) {
    let url = this.server + `/api/v2.1/workflows/${token}/tasks/`;
    let params = {};
    if (filterType) {
      params.filter_type = filterType;
    }
    if (page) {
      params.page = page;
    }
    if (perPage) {
      params.per_page = perPage;
    }
    return this.req.get(url, {
      params
    });
  }

  // other not-admin APIs
  getUserInfo() {
    const url = this.server + '/api/v2.1/user/';
    return this.req.get(url);
  }

  getUserCommonInfo(email, avatarSize) {
    const url = this.server + '/api/v2.1/user-common-info/' + email + '/';
    let params = {
      avatar_size: avatarSize
    };
    return this.req.get(url, {params: params});
  }
  
  getOrganization(org_id) {
    const url = this.server + '/api/v2.1/organizations/' + org_id + '/';
    return this.req.get(url);
  }

  getOrganizationMembers(org_id, page) {
    const url = this.server + '/api/v2.1/organizations/' + org_id + '/members/?page=' + page;
    return this.req.get(url);
  }

  getChargebeeCustomer() {
    const url = this.server + '/api/v2.1/chargebee/customer/';
    return this.req.get(url);
  }

  chargebeeCheckout(planID) {
    const url = this.server + '/api/v2.1/chargebee/checkout/';
    return this.req.post(url, { plan_id: planID });
  }

  getSubscription() {
    const url = this.server + '/api/v2.1/subscription/';
    return this.req.get(url);
  }

  getSubscriptionPlans(paymentType) {
    const url = this.server + '/api/v2.1/subscription/plans/';
    let params = {
      payment_type: paymentType,
    };
    return this.req.get(url, {params: params});
  }

  getSubscriptionLogs() {
    const url = this.server + '/api/v2.1/subscription/logs/';
    return this.req.get(url);
  }

  listGroups(includingAllDeps=false) {
    const url = this.server + '/api/v2.1/groups/';
    let params = {including_all_deps: includingAllDeps};
    return this.req.get(url, {params: params});
  }

  exchangeCoinByCode(code) {
    const url = this.server + '/api/v2.1/subscription/coin-exchange/';
    return this.req.post(url, {code: code});
  }

  getGroup(groupID) {
    const url = this.server + '/api/v2.1/groups/' + groupID + '/';
    return this.req.get(url);
  }

  createGroup(name) {
    const url = this.server + '/api/v2.1/groups/';
    let form = new FormData();
    form.append('name', name);
    return this._sendPostRequest(url, form);
  }

  renameGroup(groupID, name) {
    const url = this.server + '/api/v2.1/groups/' + groupID + '/';
    const params = {
      name: name
    };
    return this.req.put(url, params);
  }

  transferGroup(groupID, newOwner) {
    const url = this.server + '/api/v2.1/groups/' + groupID + '/';
    const form = {
      owner: newOwner
    };
    return this.req.put(url, form);
  }

  deleteGroup(groupID) {
    var url = this.server + '/api/v2.1/groups/' + groupID + '/';
    return this.req.delete(url);
  }

  addGroupMembers(groupID, userNames) {
    const url = this.server + '/api/v2.1/groups/' + groupID + '/members/bulk/';
    let form = new FormData();
    form.append('emails', userNames.join(','));
    return this._sendPostRequest(url, form);
  }

  searchGroupMember(groupID, q) {
    const url = this.server + '/api/v2.1/groups/' + groupID + '/search-member/';
    const params = {
      q: q
    };
    return this.req.get(url, {params: params});
  }

  listGroupMembers(groupID, isAdmin=false, avatarSize=64) {
    let url = this.server + '/api/v2.1/groups/' + groupID + '/members/?avatar_size=' + avatarSize + '&is_admin=' + isAdmin;
    return this.req.get(url);
  }


  listGroupTrashDTables(groupID){
    let url = this.server + '/api/v2.1/groups/' + groupID + '/trash-dtables/';
    return this.req.get(url);
  }

  restoreGroupTrashDTable(dtableUuid, groupID){
    let url = this.server + '/api/v2.1/groups/' + groupID + '/trash-dtables/'  + dtableUuid + '/';
    return this.req.put(url);
  }

  setGroupAdmin(groupID, userName, isAdmin) {
    let name = encodeURIComponent(userName);
    let url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
    const params = {
      is_admin: isAdmin
    };
    return this.req.put(url, params);
  }

  deleteGroupMember(groupID, userName) {
    const name = encodeURIComponent(userName);
    const url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
    return this.req.delete(url);
  }

  getSeafileConnectors(dtableId) {
    let url = this.server + '/api/v2.1/seafile-connectors/';
    let params = {
      dtable_id: dtableId
    };
    return this.req.get(url, {
      params: params
    });
  }

  moveUserGroupsOrder(group_id, anchor_group_id, to_last) {
    let url = this.server + '/api/v2.1/groups/move-group/';
    const params = {
      group_id,
      anchor_group_id,
      to_last
    };
    return this.req.put(url, params);
  }

  listShareableGroups() {
    const url = this.server + '/api/v2.1/shareable-groups/';
    return this.req.get(url);
  }

  listUserInfo(userIdList) {
    var url = this.server + '/api/v2.1/user-list/';
    let operation = {
      user_id_list: userIdList
    };
    return this._sendPostRequest(url, operation, { headers: { 'Content-type': 'application/json' }});
  }

  listDTableAsset(dtableUuid, parent_dir) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid + '/';
    if (parent_dir) {
      url = url + '?parent_dir=' + parent_dir;
    }
    return this.req.get(url);
  }

  deleteDTableAsset(dtableUuid, parentPath, direntName) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid + '/';
    url += '?parent_path=' + parentPath + '&name=' + direntName;
    return this.req.delete(url);
  }

  deleteMutipleTableAsset(dtableUuid, parentPath, assetNames) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid + '/batch-delete-assets/';
    let operation = {
      'parent_path': parentPath,
      'asset_names': assetNames
    };
    return this.req['delete'](url, {
      data: operation
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  zipDTableAssetFiles(dtableUuid, filesMap) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid  + '/zip-task/';

    let data = {'files_map': filesMap};

    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  renameDTableAssetFile(dtableUuid, path, newName) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid + '/rename/';
    const form = new FormData();
    form.append('path', path);
    form.append('new_name', newName);
    return this._sendPostRequest(url, form);
  }

  fileTransferSave(dtableUuid, filesMap, path, replace, relativePath) {
    let url = this.server + '/api/v2.1/seafile-connectors/' + dtableUuid + '/file-transfer-task/';
    let data = {
      'files_map': filesMap,
      'parent_dir': path,
      'replace': replace
    };
    if (relativePath) {
      data['relative_path'] = relativePath;
    }
    return this._sendPostRequest(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  listRecentUploadedFiles(dtableUuid) {
    let url = this.server + '/api/v2.1/dtable-recent-asset/' + dtableUuid + '/';
    return this.req.get(url);
  }

  listCommonDatasets(dstDTableUuid, byGroup=false) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/';
    let params = {};
    if (dstDTableUuid) {
      params.dst_dtable_uuid = dstDTableUuid;
    }
    params.by_group = byGroup;
    return this.req.get(url, {
      params: params
    });
  }

  getCommonDataset(datasetId, start, limit) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/?';
    if (start || start === 0) {
      url += `start=${start}&`;
    }
    if (limit) {
      url += `limit=${limit}`;
    }
    return this.req.get(url);
  }

  getCommonDatasetInfo(datasetId) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/info/';
    return this.req.get(url);
  }

  createCommonDataset(datasetName, workspaceID, dtableName, tableName, viewName) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/';
    let formData = new FormData();
    formData.append('dataset_name', datasetName);
    formData.append('workspace_id', workspaceID);
    formData.append('dtable_name', dtableName);
    formData.append('table_name', tableName);
    formData.append('view_name', viewName);
    return this._sendPostRequest(url, formData);
  }

  renameCommonDataset(datasetId, datasetName) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/';
    let form = new FormData();
    form.append('dataset_name', datasetName);
    return this.req.put(url, form);
  }

  deleteCommonDataset(datasetId) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/';
    return this.req.delete(url);
  }

  importCommonDataset(datasetId, dst_dtable_uuid) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/import/';
    let formData = new FormData();
    formData.append('dst_dtable_uuid', dst_dtable_uuid);
    return this._sendPostRequest(url, formData);
  }

  syncWithExistTable(datasetId, dst_dtable_uuid, dst_table_id, is_sync_periodically) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/sync-with-exist-table/';
    let formData = new FormData();
    formData.append('dst_dtable_uuid', dst_dtable_uuid);
    formData.append('dst_table_id', dst_table_id);
    if (is_sync_periodically) {
      formData.append('is_sync_periodically', true);
    }
    return this._sendPostRequest(url, formData);
  }

  syncCommonDataset(datasetId, dst_dtable_uuid, dst_table_id) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/sync/';
    let formData = new FormData();
    formData.append('dst_dtable_uuid', dst_dtable_uuid);
    formData.append('dst_table_id', dst_table_id);
    return this._sendPostRequest(url, formData);
  }

  setCommonDatasetSyncPeriodically(datasetId, dst_dtable_uuid, dst_table_id, updates) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/sync/';
    let formData = new FormData();
    formData.append('dst_dtable_uuid', dst_dtable_uuid);
    formData.append('dst_table_id', dst_table_id);
    if (updates.is_sync_periodically) {
      formData.append('is_sync_periodically', updates.is_sync_periodically);
    }
    if (updates.sync_interval) {
      formData.append('sync_interval', updates.sync_interval);
    }
    return this.req.put(url, formData);
  }

  listCommonDatasetSyncs(dst_dtable_uuid) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/syncs/';
    url += '?dst_dtable_uuid=' + dst_dtable_uuid;
    return this.req.get(url);
  }

  listDatasetAccessibleGroups(datasetId) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/access-groups/';
    return this.req.get(url);
  }

  addDatasetAccessibleGroup(datasetId, groupIdList) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/access-groups/';
    let formData = new FormData();
    groupIdList.map(groupId => formData.append('group_id', groupId));
    return this._sendPostRequest(url, formData);
  }

  deleteDatasetAccessibleGroup(datasetId, groupId) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/access-groups/' + groupId + '/';
    return this.req.delete(url);
  }

  markNoticeAsRead(noticeId) {
    const url = this.server + '/api/v2.1/notification/';
    let from = new FormData();
    from.append('notice_id', noticeId);
    return this.req.put(url, from);
  }

  listNotifications(page, perPage) {
    const url = this.server + '/api/v2.1/notifications/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  listSysUserUnseenNotifications(){
    const url = this.server + '/api/v2.1/sys-user-notifications/unseen/';
    return this.req.get(url);
  }

  setSysUserNotificationToSeen(nid){
    let url = this.server + '/api/v2.1/sys-user-notifications/' + nid + '/seen/';
    return this.req.put(url);
  }

  updateNotifications() {
    const url = this.server + '/api/v2.1/notifications/';
    return this.req.put(url);
  }

  deleteNotifications() {
    const url = this.server + '/api/v2.1/notifications/';
    return this.req.delete(url);
  }

  getUnseenNotificationCount() {
    const url = this.server + '/api/v2.1/notifications/';
    return this.req.get(url);
  }

  queryOfficeFileConvertStatus(repoID, commitID, path, fileType, shareToken) {
    const url = this.server + '/office-convert/status/';
    const params = {
      repo_id: repoID,
      commit_id: commitID,
      path: path,
      doctype: fileType // 'document' or 'spreadsheet'
    };
    // for view of share link
    if (shareToken) {
      params['token'] = shareToken;
    }
    return this.req.get(url, {
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      params: params
    });
  }

  searchUsers(searchParam) {
    const url = this.server + '/api2/search-user/?q=' + encodeURIComponent(searchParam);
    return this.req.get(url);
  }

  sendUploadLink(token, email, extraMsg) {
    const url = this.server + '/api2/send-upload-link/';
    let form = new FormData();
    form.append('token', token);
    form.append('email', email);
    if (extraMsg) {
      form.append('extra_msg', extraMsg);
    }
    return this._sendPostRequest(url, form);
  }

  sendShareLink(token, email, extraMsg) {
    const url = this.server + '/api2/send-share-link/';
    let form = new FormData();
    form.append('token', token);
    form.append('email', email);
    if (extraMsg) {
      form.append('extra_msg', extraMsg);
    }
    return this._sendPostRequest(url, form);
  }

  shareableGroups() {
    const url = this.server + '/api/v2.1/shareable-groups/';
    return this.req.get(url);
  }

  listDepartments() {
    const url = this.server + '/api/v2.1/departments/';
    return this.req.get(url);
  }

  listAddressBookDepartments() {
    const url = this.server + '/api/v2.1/address-book/departments/';
    return this.req.get(url);
  }

  listAddressBookDepartmentMembers(department_id) {
    const url = this.server + '/api/v2.1/address-book/departments/' + department_id + '/members/';
    return this.req.get(url);
  }

  getInvitationLink() {
    const url = this.server + '/api/v2.1/invitation-link/';
    return this.req.get(url);
  }

  listSessions() {
    const url = this.server + '/api/v2.1/sessions/';
    return this.req.get(url);
  }

  deleteSession(session_key) {
    const url = this.server + '/api/v2.1/sessions/' + session_key + '/';
    return this.req.delete(url);
  }

  logOutSession(session_key) {
    const url = this.server + '/api/v2.1/online-sessions/' + session_key + '/';
    return this.req.delete(url);
  }

  //account api

  getAccountInfo() {
    const url =  this.server + '/api2/account/info/';
    return this.req.get(url);
  }

  sendVerifyCode(phone, type) {
    let url = this.server + '/api/v2.1/user/sms-verify/';
    let data = {
      phone: phone,
      type: type
    };
    return this.req.post(url, data);
  }

  bindPhoneNumber(phone, code) {
    let url = this.server + '/api/v2.1/user/bind-phone/';
    let data = {
      phone: phone,
      code: code
    };
    return this.req.post(url, data);
  }

  unbindPhoneNumber(phone, code) {
    let url = this.server + '/api/v2.1/user/unbind-phone/';
    let data = {
      phone: phone,
      code: code
    };
    return this.req.post(url, data);
  }

  updateEmailNotificationInterval(dtableUpdatesEmailInterval, dtableCollaborateEmailInterval) {
    const url = this.server + '/api2/account/info/';
    const data = {
      'dtable_updates_email_interval': dtableUpdatesEmailInterval,
      'dtable_collaborate_email_interval': dtableCollaborateEmailInterval,
    };
    return this.req.put(url, data);
  }

  updateUserAvatar(avatarFile, avatarSize) {
    const url = this.server + '/api/v2.1/user-avatar/';
    let form = new FormData();
    form.append('avatar', avatarFile);
    form.append('avatar_size', avatarSize);
    return this._sendPostRequest(url, form);
  }

  updateUserInfo({name, telephone, contact_email, list_in_address_book, sms_2fa}) {
    const url = this.server + '/api/v2.1/user/';
    let data = {};
    if (name != undefined) {
      data.name = name;
    }
    if (telephone != undefined) {
      data.telephone = telephone;
    }
    if (contact_email != undefined) {
      data.contact_email = contact_email;
    }
    if (list_in_address_book != undefined) {
      data.list_in_address_book = list_in_address_book;
    }
    if (sms_2fa != undefined) {
      data.sms_2fa = sms_2fa;
    }
    return this.req.put(url, data);
  }

  bindContactEmail(newContactEmail) {
    let url = this.server + '/api/v2.1/user/contact-email/';
    let form = new FormData();
    form.append('new_contact_email', newContactEmail);
    return this.req.put(url, form);
  }

  listNotificationRules(workspace_id, dtable_name) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/notification-rules/';
    return this.req.get(url);
  }

  addNotificationRule(workspace_id, dtable_name, ruleJson) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/notification-rules/';
    return this._sendPostRequest(url, ruleJson, { headers: { 'Content-type': 'application/json' }});
  }

  deleteNotificationRule(workspace_id, dtable_name, notificationRuleId) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/notification-rules/' + notificationRuleId + '/';
    return this.req.delete(url);
  }
  
  updateNotificationRule(workspace_id, dtable_name, notificationRuleId, ruleJson) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/notification-rules/' + notificationRuleId + '/';
    return this.req.put(url, ruleJson,  { headers: { 'Content-type': 'application/json' }});
  }

  listAutomationRules(workspace_id, dtable_name) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/';
    return this.req.get(url);
  }

  addAutomationRule(workspace_id, dtable_name, ruleJson) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/';
    return this._sendPostRequest(url, ruleJson, { headers: { 'Content-type': 'application/json' }});
  }

  deleteAutomationRule(workspace_id, dtable_name, automationRuleId) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/' + automationRuleId + '/';
    return this.req.delete(url);
  }
  
  updateAutomationRule(workspace_id, dtable_name, automationRuleId, ruleJson) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/' + automationRuleId + '/';
    return this.req.put(url, ruleJson,  { headers: { 'Content-type': 'application/json' }});
  }

  testAutomationRule(workspace_id, dtable_name, automationRuleId) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/' + automationRuleId + '/run-test/';
    return this.req.post(url);
  }

  listAutomationRuleTaskLog(workspace_id, dtable_name, automationRuleId, page) {
    const url = this.server + '/api/v2.1/workspace/' + workspace_id + '/dtable/' + encodeURIComponent(dtable_name) + '/automation-rules/' + automationRuleId + '/task-logs/?page=' + page;
    return this.req.get(url);
  }

  runScript(dtableUuid, scriptName, data) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/`;
    if (data) {
      return this.req.post(url, data);
    }
    return this.req.post(url);
  }

  getScriptResult(dtableUuid, scriptName, scriptID) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/result/${scriptID}/`;
    return this.req.get(url);
  }

  getScriptTask(dtableUuid, scriptName) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/`;
    return this.req.get(url);
  }

  addScriptTask(dtableUuid, scriptName, taskData) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/`;
    return this.req.post(url, taskData);
  }

  updateScriptTask(dtableUuid, scriptName, taskData) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/`;
    return this.req.put(url, taskData);
  }

  deleteScriptTask(dtableUuid, scriptName) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/`;
    return this.req.delete(url);
  }

  listScriptTaskLogs(dtableUuid, scriptName, page) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/logs/?page=${page}&per_page=15`;
    return this.req.get(url);
  }

  getScriptTaskLog(dtableUuid, scriptName, logId) {
    const url = this.server + `/api/v2.1/dtable/${dtableUuid}/run-script/${scriptName}/task/logs/${logId}/`;
    return this.req.get(url);
  }

  listTemplates() {
    const url = '/api/v2.1/templates/';
    return this.req.get(url);
  }

  getBaseSharePermission(workspaceId, dtableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/base-share-permission/';
    return this.req.get(url);
  }

  getSharePermission(workspaceId, dtableName, permissionId) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/share-permissions/' + permissionId + '/';
    return this.req.get(url);
  }

  getSharedPermission(workspaceId, dtableName, permissionId) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/shared-permissions/' + permissionId + '/';
    return this.req.get(url);
  }

  getSharePermissions(workspaceId, dtableName) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/share-permissions/';
    return this.req.get(url);
  }

  addSharePermission(workspaceId, dtableName, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/share-permissions/';
    return this.req.post(url, permission);
  }

  updateSharePermission(workspaceId, dtableName, permissionId, permission) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/share-permissions/' + permissionId + '/';
    return this.req.put(url, permission);
  }

  deleteSharePermission(workspaceId, dtableName, permissionId) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtableName) + '/share-permissions/' + permissionId + '/';
    return this.req.delete(url);
  }

  getGroupInviteLinks(groupId) {
    const url = this.server + '/api/v2.1/groups/' + groupId + '/invite-links/';
    return this.req.get(url);
  }

  addGroupInviteLinks(groupId) {
    const url = this.server + '/api/v2.1/groups/' + groupId + '/invite-links/';
    return this.req.post(url);
  }

  deleteGroupInviteLinks(groupId, token) {
    const url = this.server + '/api/v2.1/groups/' + groupId + '/invite-links/' + token + '/';
    return this.req.delete(url);
  }

  // org admin api
  orgAdminUpdateOrgInfo(newOrgName) {
    let url = this.server + '/api/v2.1/org/admin/info/';
    let formData = new FormData();
    formData.append('new_org_name', newOrgName);
    return this.req.put(url, formData);
  }

  orgAdminAddDepartGroup(orgID, parentGroup, groupName, groupOwner, groupStaff) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/address-book/groups/';
    let form = new FormData();
    form.append('parent_group', parentGroup);
    form.append('group_name', groupName);
    if (groupOwner) {
      form.append('group_owner', groupOwner);
    }
    if (groupStaff) {
      form.append('group_staff', groupStaff.join(','));
    }
    return this._sendPostRequest(url, form);
  }

  orgAdminUpdateDepartGroup(orgID, groupID, groupName) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/address-book/groups/' + groupID + '/';
    let form = new FormData();
    form.append('group_name', groupName);
    return this.req.put(url, form);
  }

  orgAdminAddDepartmentRepo(orgID, groupID, repoName) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/group-owned-libraries/';
    let form = new FormData();
    form.append('repo_name', repoName);
    return this._sendPostRequest(url, form);
  }

  orgAdminAddGroupMember(orgID, groupID, userEmail) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID +  '/members/';
    let form = new FormData();
    form.append('email', userEmail);
    return this._sendPostRequest(url, form);
  }

  orgAdminListGroupDTables(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/dtables/';
    return this.req.get(url);
  }

  orgAdminDeleteDTableFromGroup(orgID, groupID, tableID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/dtables/' + tableID + '/';
    return this.req.delete(url);
  }

  orgAdminAddOrgUser(orgID, email, name, password) {
    const url =  this.server + '/api/v2.1/org/' + orgID +'/admin/users/';
    let form = new FormData();
    form.append('email', email);
    form.append('name', name);
    form.append('password', password);
    return this._sendPostRequest(url, form);
  }

  orgAdminInviteOrgUser(orgID, emails) {
    const url =  this.server + '/api/v2.1/org/' + orgID +'/admin/invite-user-email/';
    let form = new FormData();
    emails.forEach(email => {
      form.append('email', email);
    });
    return this._sendPostRequest(url, form);
  }

  orgAdminChangeOrgUserStatus(orgID, email, statusCode) {
    const url = this.server +'/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    let form = new FormData();
    form.append('is_active', statusCode);
    return this.req.put(url, form);
  }

  orgAdminDeleteDepartGroup(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/address-book/groups/' + groupID + '/';
    return this.req.delete(url);
  }

  orgAdminDeleteDepartmentRepo(orgID, groupID, repoID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/group-owned-libraries/' + repoID;
    return this.req.delete(url);
  }

  orgAdminDeleteGroupMember(orgID, groupID, userEmail) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/members/' + encodeURIComponent(userEmail) + '/';
    return this.req.delete(url);
  }

  orgAdminDeleteOrgGroup(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/groups/' + groupID + '/';
    return this.req.delete(url);
  }

  orgAdminTransferOrgGroup(orgID, receiverEmail, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/';
    let formData = new FormData();
    formData.append('new_owner', receiverEmail);
    return this.req.put(url, formData);
  }

  orgAdminDeleteOrgLink(token) {
    const url = this.server + '/api/v2.1/org/admin/links/' + token + '/';
    return this.req.delete(url);
  }

  orgAdminDeleteOrgRepo(orgID, repoID) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/repos/' + repoID + '/';
    return this.req.delete(url);
  }

  orgAdminDeleteOrgUser(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    return this.req.delete(url);
  }

  orgAdminGetFileUpdateDetail(repoID, commitID) {
    let url = this.server + '/ajax/repo/' + repoID + '/history/changes/?commit_id=' + commitID;
    return this.req.get(url, { headers: {'X-Requested-With': 'XMLHttpRequest'}});
  }

  orgAdminGetGroup(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/groups/' + groupID + '/';
    return this.req.get(url);
  }

  orgAdminGetOrgInfo() {
    const url = this.server + '/api/v2.1/org/admin/info/';
    return this.req.get(url);
  }

  orgAdminGetOrgUserBesharedRepos(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/beshared-repos/';
    return this.req.get(url);
  }

  orgAdminGetOrgUserInfo(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    return this.req.get(url);
  }

  orgAdminGetOrgUserOwnedRepos(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/repos/';
    return this.req.get(url);
  }

  orgAdminListDepartGroups(orgID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/address-book/groups/';
    return this.req.get(url);
  }

  orgAdminSetForceTwoFactorAuth(orgID, email, isForce2FA) {
    let isForce = isForce2FA ? 1 : 0;
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/' + encodeURIComponent(email) + '/two-factor-auth/';
    let formData = new FormData();
    formData.append('force_2fa', isForce);
    return this.req.put(url, formData);
  }

  orgAdminDeleteTwoFactorAuth(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/two-factor-auth/';
    return this.req.delete(url);
  }

  orgAdminListFileAudit(email, repoID, page) {
    let url = this.server + '/api/v2.1/org/admin/logs/file-access/?page=' + page;
    if (email) {
      url = url + '&email=' + encodeURIComponent(email);
    }
    if (repoID) {
      url = url + '&repo_id=' + repoID;
    }
    return this.req.get(url);
  }

  orgAdminListFileUpdate(email, repoID, page) {
    let url = this.server + '/api/v2.1/org/admin/logs/file-update/?page=' + page;
    if (email) {
      url = url + '&email=' + encodeURIComponent(email);
    }
    if (repoID) {
      url = url + '&repo_id=' + repoID;
    }
    return this.req.get(url);
  }

  orgAdminListGroupInfo(orgID, groupID, showAncestors) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/address-book/groups/' + groupID + '/?return_ancestors=' + showAncestors;
    return this.req.get(url);
  }

  orgAdminListGroupMembers(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/members/';
    return this.req.get(url);
  }

  orgAdminListGroupRepos(orgID, groupID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/libraries/';
    return this.req.get(url);
  }

  orgAdminListOrgGroups(orgID, page) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/groups/?page=' + page;
    return this.req.get(url);
  }

  orgAdminListOrgLinks(page) {
    const url = this.server + '/api/v2.1/org/admin/links/?page=' + page;
    return this.req.get(url);
  }

  orgAdminListOrgRepos(orgID, page) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/repos/?page=' + page;
    return this.req.get(url);
  }
  orgAdminListOrgUsers(orgID, isStaff, page) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/users/?is_staff=' + isStaff + '&page=' + page;
    return this.req.get(url);
  }

  orgAdminListPermAudit(email, repoID, page) {
    let url = this.server + '/api/v2.1/org/admin/logs/repo-permission/?page=' + page;
    if (email) {
      url = url + '&email=' + encodeURIComponent(email);
    }
    if (repoID) {
      url = url + '&repo_id=' + repoID;
    }
    return this.req.get(url);
  }

  orgAdminResetOrgUserPassword(orgID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/set-password/';
    return this.req.put(url);
  }

  orgAdminSetGroupMemberRole(orgID, groupID, userEmail, isAdmin) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID +  '/members/' + encodeURIComponent(userEmail) + '/';
    let form = new FormData();
    form.append('is_admin', isAdmin);
    return this.req.put(url, form);
  }

  orgAdminSetGroupQuota(orgID, groupID, quota) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/groups/' + groupID + '/';
    let form = new FormData();
    form.append('quota', quota);
    return this.req.put(url, form);
  }

  orgAdminSetOrgAdmin(orgID, email, isStaff) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/users/' + encodeURIComponent(email) + '/';
    let form = new FormData();
    form.append('is_staff', isStaff);
    return this.req.put(url, form);
  }

  orgAdminSetOrgUserContactEmail(orgID, email, contactEmail) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    const data = {
      contact_email: contactEmail
    };
    return this.req.put(url, data);
  }

  orgAdminSetOrgUserName(orgID, email, name) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    const data = {
      name: name
    };
    return this.req.put(url, data);
  }

  orgAdminSetOrgUserQuota(orgID, email, quota) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    const data = {
      quota_total: quota
    };
    return this.req.put(url, data);
  }

  orgAdminSetOrgUserIdInOrg(orgID, email, IdInOrg) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/users/'+ encodeURIComponent(email) + '/';
    const data = {
      id_in_org: IdInOrg
    };
    return this.req.put(url, data);
  }

  orgAdminTransferOrgRepo(orgID, repoID, email) {
    const url = this.server + '/api/v2.1/org/' + orgID +  '/admin/repos/' + repoID + '/';
    let form = new FormData();
    form.append('email', email);
    return this.req.put(url, form);
  }

  orgAdminListDTables(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  orgAdminDeleteDTable(orgID, dtableID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/dtables/' + dtableID + '/';
    return this.req.delete(url);
  }

  orgAdminAddExportDTableTask(orgID, dtableUuid) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/dtables/' + dtableUuid + '/export-dtable/';
    return this.req.get(url);
  }

  orgAdminListTrashDTables(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/trash-dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  orgAdminCleanTrashDTables(orgID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/trash-dtables/';
    return this.req.delete(url);
  }

  orgAdminRestoreTrashDTable(orgID, dtableID, restoreToAdminAccount) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/trash-dtables/' + dtableID + '/';
    const data = {
      restore_to_admin_account: restoreToAdminAccount
    };
    return this.req.put(url, data);
  }

  orgAdminSearchDTables(orgID, query, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/search-dtables/';
    let params = {
      query: query,
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  orgAdminGetSettings() {
    const url = this.server + '/api/v2.1/org/admin/settings/';
    return this.req.get(url);
  }

  orgAdminUpdateSettings(key, value) {
    const url = this.server + '/api/v2.1/org/admin/settings/';
    let form = new FormData();
    form.append(key, value);
    return this.req.put(url, form);
  }

  orgAdminBindWorkWeixin(orgID, corpID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/bind/';
    return this.req.post(url, {corp_id: corpID});
  }

  orgAdminGetWorkWeixinInfo(orgID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/info/';
    return this.req.get(url);
  }

  orgAdminListWorkWeixinUsers(orgID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/users/';
    return this.req.get(url);
  }

  orgAdminImportWorkWeixinUser(orgID, user) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/users/';
    return this.req.post(url, {user: user});
  }

  orgAdminDisconnectWorkWeixinUser(orgID, user) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/user/';
    let params = {user: user};
    return this.req.delete(url, {data: params});
  }

  orgAdminWorkWeixinCreateLicenseOrder(orgID, count) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/create-license-order/';
    return this.req.post(url, {count: count});
  }

  orgAdminGetDingtalkInfo(orgID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/dingtalk/info/';
    return this.req.get(url);
  }

  orgAdminAddWorkWeixinUsersBatch(orgID, userList) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/users/batch/';
    return this.req.post(url, {userlist: userList});
  }

  orgAdminImportWorkWeixinDepartment(orgID, departmentID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/departments/import/';
    return this.req.post(url, {work_weixin_department_id: departmentID});
  }

  orgAdminListWorkWeixinDepartmentMembers(orgID, departmentID, params) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/departments/' + departmentID + '/members/';
    return this.req.get(url, {params: params});
  }

  orgAdminListWorkWeixinDepartments(orgID, departmentID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/work-weixin/departments/';
    const params = {};
    if (departmentID) {
      params.department_id = departmentID;
    }
    return this.req.get(url, {params: params});
  }

  orgAdminListDTableExternalLinks(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/external-links/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  orgAdminDeleteDTableExternalLink(orgID, token) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/external-links/' + token + '/';
    return this.req.delete(url);
  }

  orgAdminListViewExternalLinks(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/view-external-links/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  orgAdminDeleteViewExternalLink(orgID, token) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/view-external-links/' + token + '/';
    return this.req.delete(url);
  }

  // sys-admin
  sysAdminListAllDTables(page, perPage) {
    const url = this.server + '/api/v2.1/admin/dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  sysAdminListTrashDTables(page, perPage) {
    let url = this.server + '/api/v2.1/admin/trash-dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminListDTableArchives(page, perPage) {
    let url = this.server + '/api/v2.1/admin/dtable-archives/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminDeleteDTableArchives(dtable_uuids) {
    let url = this.server + '/api/v2.1/admin/dtable-archives/';
    let params = {
      dtable_uuids: dtable_uuids,
    };

    return this.req.delete(url, {
      data: params
    });
  }

  sysAdminListArchiveBackups(dtable_uuid) {
    let url = this.server + '/api/v2.1/admin/dtable-archives/' + dtable_uuid + '/backups/';
    return this.req.get(url);
  }

  sysAdminRestoreTrashDTable(dtableID, restoreToAdminAccount) {
    const url = this.server + '/api/v2.1/admin/trash-dtables/' + dtableID + '/';
    const data = {
      restore_to_admin_account: restoreToAdminAccount
    };
    return this.req.put(url, data);
  }

  sysAdminSearchDTables(query, page, perPage) {
    let url = this.server + '/api/v2.1/admin/search-dtable/';
    let params = {
      query: query,
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteDTable(dtable_uuid) {
    const url = this.server + '/api/v2.1/admin/dtable/' + dtable_uuid + '/';
    return this.req.delete(url);
  }

  sysAdminUnsetDTablePassword(dtable_uuid) {
    const url = this.server + '/api/v2.1/admin/dtable/' + dtable_uuid + '/unset-password/';
    return this.req.put(url);
  }
  
  sysAdminListForms(page, perPage) {
    let url = this.server + '/api/v2.1/admin/forms/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminDeleteForm(token) {
    let url = this.server + '/api/v2.1/admin/forms/' + token + '/';
    return this.req.delete(url);
  }

  sysAdminListCollectionTables(page, perPage) {
    let url = this.server + '/api/v2.1/admin/collection-tables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminDeleteCollectionTable(token) {
    let url = this.server + '/api/v2.1/admin/collection-tables/' + token + '/';
    return this.req.delete(url);
  }

  sysAdminListEmailSendingLogs(page, perPage) {
    let url = this.server + '/api/v2.1/admin/email-sending-logs/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  // sysadmin org api
  sysAdminListOrgs(page, per_page, role) {
    const url = this.server + '/api/v2.1/admin/organizations/';
    let params = {
      page,
      per_page,
      role
    };
    return this.req.get(url, {
      params
    });
  }

  sysAdminListOrgBigDataStorageStats(page, per_page) {
    const url = this.server + '/api/v2.1/admin/organizations/big-data-storage-stats/';
    let params = {
      page,
      per_page
    };
    return this.req.get(url, {
      params
    });
  }

  sysAdminListOrgUniversalAppsStats(page, per_page) {
    const url = this.server + '/api/v2.1/admin/organizations/universal-app-stats/';
    let params = {
      page,
      per_page
    };
    return this.req.get(url, {
      params
    });
  }

  sysAdminGetOrg(orgID) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/';
    return this.req.get(url);
  }

  sysAdminUpdateOrg(orgID, orgInfo) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/';
    let formData = new FormData();
    if (orgInfo.orgName) {
      formData.append('org_name', orgInfo.orgName);
    }
    if (orgInfo.maxUserNumber) {
      formData.append('max_user_number', orgInfo.maxUserNumber);
    }
    if (orgInfo.quota) {
      formData.append('quota', orgInfo.quota);
    }
    if (orgInfo.role) {
      formData.append('role', orgInfo.role);
    }
    if (orgInfo.rowLimit) {
      formData.append('row_limit', orgInfo.rowLimit);
    }
    if (orgInfo.assetQuotaMb) {
      formData.append('asset_quota_mb', orgInfo.assetQuotaMb);
    }
    if (orgInfo.bigDataRowLimit) {
      formData.append('big_data_row_limit', orgInfo.bigDataRowLimit);
    }
    return this.req.put(url, formData);
  }

  sysAdminAddOrg(orgName, adminEmail, adminName, password) {
    const url = this.server + '/api/v2.1/admin/organizations/';
    let formData = new FormData();
    formData.append('org_name', orgName);
    formData.append('admin_email', adminEmail);
    formData.append('admin_name', adminName);
    formData.append('password', password);
    return this._sendPostRequest(url, formData);
  }

  sysAdminDeleteOrg(orgID) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/';
    return this.req.delete(url);
  }

  sysAdminListOrgUsers(orgID, is_staff) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/users/?is_staff=' + is_staff;
    return this.req.get(url);
  }

  sysAdminAddOrgUser(orgID, email, name, password) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/users/';
    let formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);
    return this._sendPostRequest(url, formData);
  }

  sysAdminUpdateOrgUser(orgID, email, attribute, value) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/users/' + encodeURIComponent(email) + '/';
    let formData = new FormData();
    switch (attribute) {
    case 'active':
      formData.append('active', value);
      break;
    case 'name':
      formData.append('name', value);
      break;
    case 'contact_email':
      formData.append('contact_email', value);
      break;
    case 'quota_total':
      formData.append('quota_total', value);
      break;
    }
    return this.req.put(url, formData);
  }

  sysAdminDeleteOrgUser(orgID, email) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/users/' + encodeURIComponent(email) + '/';
    return this.req.delete(url);
  }

  sysAdminListOrgGroups(orgID) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/groups/';
    return this.req.get(url);
  }

  sysAdminListOrgDTables(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminSearchOrgs(query) {
    let url = this.server + '/api/v2.1/admin/search-organization/';
    let params = {
      query: query
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListUsers(page, perPage, isLDAPImport) {
    let url = this.server + '/api/v2.1/admin/users/';
    let params = {
      page: page,
      per_page: perPage
    };
    if (isLDAPImport) {
      url += '?source=ldapimport';
    }
    return this.req.get(url, {params: params});
  }

  sysAdminFilterUsers(page, perPage, {userStatus, userRole, orderBy, direction}) {
    let url = this.server + '/api/v2.1/admin/filter-users/';
    let params = {
      page: page,
      per_page: perPage,
    };
    if (userStatus) {
      params.user_status = userStatus;
    }
    if (userRole) {
      params.role = userRole;
    }
    if (orderBy) {
      params.order_by = orderBy;
    }
    if (direction) {
      params.direction = direction;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminAddUser(email, name, role, password) {
    const url = this.server + '/api/v2.1/admin/users/';
    let formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('role', role);
    formData.append('password', password);
    return this._sendPostRequest(url, formData);
  }

  sysAdminUpdateUser(email, attribute, value) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/';
    let formData = new FormData();
    switch (attribute) {
    case 'password':
      formData.append('password', value);
      break;
    case 'is_active':
      formData.append('is_active', value);
      break;
    case 'is_staff':
      formData.append('is_staff', value);
      break;
    case 'role':
      formData.append('role', value);
      break;
    case 'name':
      formData.append('name', value);
      break;
    case 'login_id':
      formData.append('login_id', value);
      break;
    case 'contact_email':
      formData.append('contact_email', value);
      break;
    case 'reference_id':
      formData.append('reference_id', value);
      break;
    case 'department':
      formData.append('department', value);
      break;
    case 'quota_total':
      formData.append('quota_total', value);
      break;
    case 'institution':
      formData.append('institution', value);
      break;
    case 'row_limit':
      formData.append('row_limit', value);
      break;
    case 'asset_quota_mb':
      formData.append('asset_quota_mb', value);
      break;
    case 'id_in_org':
      formData.append('id_in_org', value);
      break;
    case 'unit':
      formData.append('unit', value);
      break;
    }
    return this.req.put(url, formData);
  }

  sysAdminDeleteUser(email) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/';
    return this.req.delete(url);
  }

  sysAdminGetUser(email, avatarSize) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/';
    let params = {};
    if (avatarSize) {
      params.avatar_size = avatarSize;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminResetUserPassword(email) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/reset-password/';
    return this.req.put(url);
  }

  sysAdminDeleteUserInBatch(emails) {
    const url = this.server + '/api/v2.1/admin/users/batch/';
    let formData = new FormData();
    emails.map(email => {
      formData.append('email', email);
    });
    formData.append('operation', 'delete-user');
    return this._sendPostRequest(url, formData);
  }

  sysAdminSetForceTwoFactorAuth(email, isForce2FA) {
    let isForce = isForce2FA ? 1 : 0;
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/two-factor-auth/';
    let formData = new FormData();
    formData.append('force_2fa', isForce);
    return this.req.put(url, formData);
  }

  sysAdminDeleteTwoFactorAuth(email) {
    const url = this.server + '/api/v2.1/admin/users/'+ encodeURIComponent(email) + '/two-factor-auth/';
    return this.req.delete(url);
  }

  sysAdminImportUserViaFile(file) {
    const url = this.server + '/api/v2.1/admin/import-users/';
    let formData = new FormData();
    formData.append('file', file);
    return this._sendPostRequest(url, formData);
  }

  sysAdminListAdmins() {
    const url = this.server + '/api/v2.1/admin/admin-users/';
    return this.req.get(url);
  }

  sysAdminUpdateAdminRole(email, role) {
    const url = this.server + '/api/v2.1/admin/admin-role/';
    let formData = new FormData();
    formData.append('email', email);
    formData.append('role', role);
    return this.req.put(url, formData);
  }

  sysAdminAddAdminInBatch(emails) {
    const url = this.server + '/api/v2.1/admin/admin-users/batch/';
    let formData = new FormData();
    emails.map(email => {
      formData.append('email', email);
    });
    return this._sendPostRequest(url, formData);
  }

  sysAdminListGroupsJoinedByUser(email) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/groups/';
    return this.req.get(url);
  }

  sysAdminListDepartGroups() {
    const url = this.server + '/api/v2.1/admin/address-book/groups/';
    return this.req.get(url);
  }

  sysAdminAddDepartGroup(groupName, parentGroup) {
    const url = this.server + '/api/v2.1/admin/address-book/groups/';
    let form = new FormData();
    form.append('group_name', groupName);
    form.append('parent_group', parentGroup);
    return this._sendPostRequest(url, form);
  }

  sysAdminGetDepartGroupInfo(groupID, showAncestors) {
    const url = this.server + '/api/v2.1/admin/address-book/groups/' + groupID + '/' + '?return_ancestors=' + showAncestors;
    return this.req.get(url);
  }

  sysAdminUpdateDepartGroup(groupID, groupName) {
    const url = this.server + '/api/v2.1/admin/address-book/groups/' + groupID + '/';
    let form = new FormData();
    form.append('group_name', groupName);
    return this.req.put(url, form);
  }

  sysAdminDeleteDepartGroup(groupID) {
    const url = this.server + '/api/v2.1/admin/address-book/groups/' + groupID + '/';
    return this.req.delete(url);
  }

  sysAdminListUserDTables(email, page, per_page) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/dtables/';
    let params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminListUserSharedDTables(email, page, per_page) {
    const url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/shared-dtables/';
    let params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminListUserRepoDirents(email, parentDir) {
    let url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/storage/';
    let params = {
      parent_dir: parentDir
    };
    return this.req.get(url, { params: params });
  }

  sysAdminRenameUserFile(email, direntPath, newName) {
    let url = this.server + '/api/v2.1/admin/users/' + encodeURIComponent(email) + '/storage/' + direntPath;
    let form = new FormData();
    form.append('new_name', newName);
    return this.req.put(url, form);
  }

  sysAdminSearchUsers(query, page, perPage) {
    var url = this.server + '/api/v2.1/admin/search-user/';
    var params = {
      query: query,
      page: page,
      per_page: perPage,
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDismissGroupByID(groupID) {
    const url = this.server + '/api/v2.1/admin/groups/' + groupID + '/';
    return this.req.delete(url);
  }

  sysAdminListGroupDTables(groupID) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/dtables/';
    return this.req.get(url);
  }

  sysAdminDeleteDTableFromGroup(groupID, tableID) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/dtables/' + tableID + '/';
    return this.req.delete(url);
  }

  sysAdminListGroupMembers(groupID) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/members/';
    return this.req.get(url);
  }

  sysAdminDeleteGroupMember(groupID, email) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/members/' + encodeURIComponent(email) + '/';
    return this.req.delete(url);
  }

  sysAdminAddGroupMember(groupID, emails) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/members/';
    let form = new FormData();
    for (var i = 0; i < emails.length; i++) {
      form.append('email', emails[i]);
    }
    return this._sendPostRequest(url, form);
  }

  sysAdminUpdateGroupMemberRole(groupID, email, isAdmin) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/members/' + encodeURIComponent(email) + '/';
    let formData = new FormData();
    formData.append('is_admin', isAdmin);
    return this.req.put(url, formData);
  }

  sysAdminListAllGroups(page, perPage) {
    let url = this.server + '/api/v2.1/admin/groups/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminCreateNewGroup(groupName, ownerEmail) {
    let url = this.server + '/api/v2.1/admin/groups/';
    let formData = new FormData();
    formData.append('group_name', groupName);
    formData.append('group_owner', ownerEmail);
    return this._sendPostRequest(url, formData);
  }

  sysAdminTransferGroup(receiverEmail, groupID) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/';
    let formData = new FormData();
    formData.append('new_owner', receiverEmail);
    return this.req.put(url, formData);
  }

  sysAdminSearchGroups(query) {
    let url = this.server + '/api/v2.1/admin/search-group/';
    let params = {
      query: query
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListGroupRepoDirents(groupID, parentDir) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/storages/';
    let params = {
      parent_dir: parentDir
    };
    return this.req.get(url, { params: params });
  }

  sysAdminRenameGroupFile(groupID, direntPath, newName) {
    let url = this.server + '/api/v2.1/admin/groups/' + groupID + '/storage/' + direntPath;
    let form = new FormData();
    form.append('new_name', newName);
    return this.req.put(url, form);
  }

  sysAdminListAllSysNotifications() {
    let url = this.server + '/api/v2.1/admin/sys-notifications/';
    return this.req.get(url);
  }

  sysAdminAddSysNotification(msg) {
    let url = this.server + '/api/v2.1/admin/sys-notifications/';
    let formData = new FormData();
    formData.append('msg', msg);
    return this._sendPostRequest(url, formData);
  }

  sysAdminDeleteSysNotification(nid) {
    let url = this.server + '/api/v2.1/admin/sys-notifications/' + nid + '/';
    return this.req.delete(url);
  }

  sysAdminUpdateSysNotification(nid, msg, primary){
    let url = this.server + '/api/v2.1/admin/sys-notifications/' + nid + '/';
    let formData = new FormData();
    if (msg) {
      formData.append('msg', msg);
    }
    if (primary) {
      formData.append('primary', primary);
    }
    return this.req.put(url, formData);
  }

  sysAdminListAllSysUserNotifications(page, perPage){
    let url = this.server + '/api/v2.1/admin/sys-user-notifications/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminAddSysUserNotification(msg, username){
    let url = this.server + '/api/v2.1/admin/sys-user-notifications/';
    let formData = new FormData();
    formData.append('msg', msg);
    formData.append('username', username);
    return this._sendPostRequest(url, formData);
  }

  sysAdminDeleteSysUserNotification(nid){
    let url = this.server + '/api/v2.1/admin/sys-user-notifications/' + nid + '/';
    return this.req.delete(url);
  }

  sysAdminListAllNotificationRules(page,perPage) {
    let url = this.server + '/api/v2.1/admin/notification-rules/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListInvalidNotificationRules(page,perPage) {
    let url = this.server + '/api/v2.1/admin/invalid-notification-rules/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteNotificationRule(rid) {
    let url = this.server + '/api/v2.1/admin/notification-rules/' + rid + '/';
    return this.req.delete(url);
  }

  sysAdminDeleteInvalidNotificationRules() {
    let url = this.server + '/api/v2.1/admin/invalid-notification-rules/' ;
    return this.req.delete(url);
  }

  sysAdminListAllAutomationRules(page, perPage) {
    let url = this.server + '/api/v2.1/admin/automation-rules/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListInvalidAutomationRules(page, perPage) {
    let url = this.server + '/api/v2.1/admin/invalid-automation-rules/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteAutomationRule(rid) {
    let url = this.server + '/api/v2.1/admin/automation-rules/' + rid + '/';
    return this.req.delete(url);
  }

  sysAdminDeleteInvalidAutomationRules() {
    let url = this.server + '/api/v2.1/admin/invalid-automation-rules/' ;
    return this.req.delete(url);
  }

  sysAdminListCommonDatasets(page, perPage) {
    let url = this.server + '/api/v2.1/admin/common-datasets/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListCommonDatasetPeriodicalSyncs(page, perPage) {
    let url = this.server + '/api/v2.1/admin/common-dataset/periodical-syncs/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListInvalidCommonDatasetSyncs(page, perPage) {
    let url = this.server + '/api/v2.1/admin/common-dataset/invalid-syncs/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteCommonDatasetSync(sid) {
    let url = this.server + '/api/v2.1/admin/common-dataset/sync/' + sid + '/';
    return this.req.delete(url);
  }

  sysAdminDeleteCommonDatasetInvalidSyncs() {
    let url = this.server + '/api/v2.1/admin/common-dataset/invalid-syncs/' ;
    return this.req.delete(url);
  }

  sysAdminListAdminLogs(page, perPage) {
    let url = this.server + '/api/v2.1/admin/admin-logs/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListAdminLoginLogs(page, perPage) {
    let url = this.server + '/api/v2.1/admin/admin-login-logs/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminListActiveUsersStatistics(startTime, endTime) {
    const url = this.server + '/api/v2.1/admin/statistics/active-users/';
    let params = {
      start: startTime,
      end: endTime,
    };
    return this.req.get(url, {params: params});
  }

  sysAdminListScriptsRunningStatistics(is_user, month, page, perPage, orderBy) {
    const url = this.server + '/api/v2.1/admin/statistics/scripts-running/';
    let params = {
      is_user: is_user,
      month: month,
      page: page,
      per_page: perPage
    };
    if (orderBy) {
      params.order_by = orderBy;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminListAutoRulesStatistics(is_user, month, page, perPage, orderBy) {
    const url = this.server + '/api/v2.1/admin/statistics/auto-rules/';
    let params = {
      is_user: is_user,
      month: month,
      page: page,
      per_page: perPage
    };
    if (orderBy) {
      params.order_by = orderBy;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminListAutoRuleStatisticDetails(is_user, month, username, org_id) {
    const url = this.server + '/api/v2.1/admin/statistics/auto-rules-details/';
    let params = {
      is_user: is_user,
      month: month,
      owner: username,
      org_id: org_id
    };
    return this.req.get(url, {params: params});
  }

  sysAdminListExternalAppsStatistics(is_user, month, page, perPage, orderBy) {
    const url = this.server + '/api/v2.1/admin/statistics/external-apps/';
    let params = {
      is_user: is_user,
      month: month,
      page: page,
      per_page: perPage
    };
    if (orderBy) {
      params.order_by = orderBy;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminGetSysSettingInfo() {
    let url = this.server + '/api/v2.1/admin/web-settings/';
    return this.req.get(url);
  }

  sysAdminSetSysSettingInfo(key, value) {
    let url = this.server + '/api/v2.1/admin/web-settings/';
    let formData = new FormData();
    formData.append(key, value);
    return this.req.put(url, formData);
  }

  sysAdminUpdateLogo(file) {
    let url = this.server + '/api/v2.1/admin/logo/';
    let formData = new FormData();
    formData.append('logo', file);
    return this._sendPostRequest(url, formData);
  }

  sysAdminUpdateFavicon(file, withNotify=null) {
    let url = this.server + '/api/v2.1/admin/favicon/';
    let formData = new FormData();
    formData.append('favicon', file);
    if (withNotify) {
      formData.append('with_notify', withNotify);
    }
    return this._sendPostRequest(url, formData);
  }

  sysAdminUpdateLoginBG(file) {
    let url = this.server + '/api/v2.1/admin/login-background-image/';
    let formData = new FormData();
    formData.append('login_bg_image', file);
    return this._sendPostRequest(url, formData);
  }

  sysAdminListExternalLinks(page, perPage) {
    let url = this.server + '/api/v2.1/admin/external-links/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteExternalLink(token) {
    let url = this.server + '/api/v2.1/admin/external-links/' + token + '/';
    return this.req.delete(url);
  }

  sysAdminListViewExternalLinks(page, perPage) {
    let url = this.server + '/api/v2.1/admin/view-external-links/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }

  sysAdminDeleteViewExternalLink(token) {
    let url = this.server + '/api/v2.1/admin/view-external-links/' + token + '/';
    return this.req.delete(url);
  }

  sysAdminListDTableExternalLinks(dtable_id) {
    let url = this.server + '/api/v2.1/admin/dtable/' + dtable_id + '/external-links/';
    return this.req.get(url);
  }

  sysAdminListDTableAPITokens(dtableUuid) {
    let url = this.server + '/api/v2.1/admin/dtables/' + dtableUuid + '/api-tokens/';
    return this.req.get(url);
  }

  sysAdminDeleteDTableAPIToken(dtableUuid, apiToken) {
    let url = this.server + '/api/v2.1/admin/dtables/' + dtableUuid + '/api-tokens/' + apiToken + '/';
    return this.req.delete(url);
  }

  sysAdminAddRepoSharedItem(repoID, shareType, shareToList, permission) {
    const url = this.server + '/api/v2.1/admin/shares/';
    let form = new FormData();
    form.append('repo_id', repoID);
    form.append('share_type', shareType);
    form.append('permission', permission);
    shareToList.map((shareTo) => {
      form.append('share_to', shareTo);
    });
    return this._sendPostRequest(url, form);
  }

  sysAdminClearDeviceErrors() {
    const url = this.server + '/api/v2.1/admin/device-errors/';
    return this.req.delete(url);
  }

  sysAdminDeleteRepoSharedItem(repoID, shareType, shareTo) {
    const url = this.server + '/api/v2.1/admin/shares/';
    const params = {
      repo_id: repoID,
      share_type: shareType,
      share_to: shareTo
    };
    return this.req.delete(url, {data: params});
  }

  sysAdminGetRepoHistorySetting(repoID) {
    const url = this.server + '/api/v2.1/admin/libraries/' + repoID + '/history-limit/';
    return this.req.get(url);
  }

  sysAdminGetSysInfo() {
    const url = this.server + '/api/v2.1/admin/sysinfo/';
    return this.req.get(url);
  }

  sysAdminListDeviceErrors() {
    const url = this.server + '/api/v2.1/admin/device-errors/';
    return this.req.get(url);
  }

  sysAdminListDevices(platform, page, per_page) {
    const url = this.server + '/api/v2.1/admin/devices/';
    let params = {
      platform: platform,
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {params: params});
  }

  sysAdminListRepoSharedItems(repoID, shareType) {
    const url = this.server + '/api/v2.1/admin/shares/';
    const params = {
      repo_id: repoID,
      share_type: shareType
    };
    return this.req.get(url, {params: params});
  }

  sysAdminUnlinkDevice(platform, deviceID, user, wipeDevice) {
    const url = this.server + '/api/v2.1/admin/devices/';
    let params = {
      platform: platform,
      device_id: deviceID,
      user: user
    };
    if (wipeDevice) {
      params.wipe_device = wipeDevice;
    }
    return this.req.delete(url, {data: params});
  }

  sysAdminUpdateRepoHistorySetting(repoID, keepDays) {
    const url = this.server + '/api/v2.1/admin/libraries/' + repoID + '/history-limit/';
    let form = new FormData();
    form.append('keep_days', keepDays);
    return this.req.put(url, form);
  }

  sysAdminUpdateRepoSharedItemPermission(repoID, shareType, shareTo, permission) {
    const url = this.server + '/api/v2.1/admin/shares/';
    const params = {
      repo_id: repoID,
      share_type: shareType,
      permission: permission,
      share_to: shareTo
    };
    return this.req.put(url, params);
  }

  sysAdminUploadLicense(file) {
    const url = this.server + '/api/v2.1/admin/license/';
    let formData = new FormData();
    formData.append('license', file);
    return this._sendPostRequest(url, formData);
  }

  sysAdminListPlugins() {
    const url = this.server + '/api/v2.1/admin/dtable-system-plugins/';
    return this.req.get(url);
  }

  sysAdminAddPlugin(formData) {
    const url = this.server + '/api/v2.1/admin/dtable-system-plugins/';
    return this.req.post(url, formData);
  }

  sysAdminUpdatePlugin(plugin_id, formData) {
    const url = this.server + '/api/v2.1/admin/dtable-system-plugins/' + plugin_id + '/';
    return this.req.put(url, formData);
  }

  sysAdminDeletePlugin(plugin_id) {
    const url = this.server + '/api/v2.1/admin/dtable-system-plugins/' + plugin_id + '/';
    return this.req.delete(url);
  }

  sysAdminListPluginsInstallCount(page, per_page) {
    const url = this.server + '/api/v2.1/admin/plugins-install-count/';
    let params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {params: params});
  }

  sysAdminListAbuseReports(page, per_page) {
    const url = this.server + '/api/v2.1/admin/abuse-reports/';
    let params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {params: params});
  }

  sysAdminUpdateAbuseReport(reportId, handled) {
    const url = this.server + '/api/v2.1/admin/abuse-reports/' + reportId + '/';
    let formData = new FormData();
    formData.append('handled', handled);
    return this.req.put(url, formData);
  }

  adminAddWorkWeixinUsersBatch(userList) {
    const url = this.server + '/api/v2.1/admin/work-weixin/users/batch/';
    return this.req.post(url, {userlist: userList});
  }

  adminImportWorkWeixinDepartment(departmentID) {
    const url = this.server + '/api/v2.1/admin/work-weixin/departments/import/';
    return this.req.post(url, {work_weixin_department_id: departmentID});
  }

  adminListWorkWeixinDepartmentMembers(departmentID, params) {
    const url = this.server + '/api/v2.1/admin/work-weixin/departments/' + departmentID + '/members/';
    return this.req.get(url, {params: params});
  }

  adminListWorkWeixinDepartments(departmentID) {
    const url = this.server + '/api/v2.1/admin/work-weixin/departments/';
    const params = {};
    if (departmentID) {
      params.department_id = departmentID;
    }
    return this.req.get(url, {params: params});
  }

  sysAdminListExternalApps(page, per_page) {
    const url = this.server + '/api/v2.1/admin/external-apps/';
    const params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminListScriptsTasks(page, per_page) {
    const url = this.server + '/api/v2.1/admin/scripts-tasks/';
    const params = {
      page: page,
      per_page: per_page
    };
    return this.req.get(url, {
      params: params
    });
  }

  sysAdminListWorkflows(page, perPage) {
    let url = this.server + '/api/v2.1/admin/workflows/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, { params: params });
  }
}

export default DTableWebAPI;
