import axios from 'axios';
import FormData from 'form-data'

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
    if (siteRoot && siteRoot.charAt(siteRoot.length-1) === "/") {
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
        method: "post",
        data: formData,
        url: uploadLink,
        onUploadProgress: onUploadProgress
      })
    );
  }

  // workspace api
  listWorkspaces() {
    const url = this.server + '/api/v2.1/workspaces/';
    return this.req.get(url);
  }

  // has been deleted
  // createWorkspace(name) {
  //   const url = this.server + '/api/v2.1/workspaces/';
  //   let form = new FormData();
  //   form.append('name', name);
  //   return this._sendPostRequest(url, form);
  // }

  // renameWorkspace(workspaceID, name) {
  //   const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/';
  //   let form = new FormData();
  //   form.append('name', name);
  //   return this.req.put(url, form);
  // }

  // deleteWorkspace(workspaceID) {
  //   const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/';
  //   return this.req.delete(url);
  // }

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
  listDTableUserViewShares(workspaceId, dtableName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/user-view-shares/';
    return this.req.get(url);
  }

  createDTableUserViewShare(workspaceId, dtableName, tableId, viewId, permission, toUser) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/user-view-shares/';
    let params = {
      table_id: tableId,
      view_id: viewId,
      permission: permission,
      to_user: toUser,
    };
    return this.req.post(url, params);
  }

  updateDTableUserViewShare(workspaceId, dtableName, viewShareId, permission) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/user-view-shares/' + viewShareId + '/';
    let params = {
      permission: permission,
    };
    return this.req.put(url, params);
  }

  deleteDTableUserViewShare(workspaceId, dtableName, viewShareId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/user-view-shares/' + viewShareId + '/';
    return this.req.delete(url);
  }

  listDTableGroupViewShares(workspaceId, dtableName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/group-view-shares/';
    return this.req.get(url);
  }

  createDTableGroupViewShare(workspaceId, dtableName, tableId, viewId, permission, toGroupId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/group-view-shares/';
    let params = {
      table_id: tableId,
      view_id: viewId,
      permission: permission,
      to_group_id: toGroupId,
    };
    return this.req.post(url, params);
  }

  updateDTableGroupViewShare(workspaceId, dtableName, viewShareId, permission) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/group-view-shares/' + viewShareId + '/';
    let params = {
      permission: permission,
    };
    return this.req.put(url, params);
  }

  deleteDTableGroupViewShare(workspaceId, dtableName, viewShareId) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + dtableName + '/group-view-shares/' + viewShareId + '/';
    return this.req.delete(url);
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
  createTable(name, owner) {
    const url = this.server + '/api/v2.1/dtables/';
    let form = new FormData();
    form.append('name', name);
    form.append('owner', owner);
    return this._sendPostRequest(url, form);
  }

  renameTable(workspaceID, old_name, new_name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
    let form = new FormData();
    form.append('old_name', old_name);
    form.append('new_name', new_name);
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

  getDTableShareLink(workspaceID, name) {
    var url = this.server + '/api/v2.1/dtables/share-links/?workspace_id=' + workspaceID + '&table_name=' + encodeURIComponent(name);
    return this.req.get(url);
  }

  createDTableShareLink(workspaceID, name, permission, password, expire_days) {
    let url = this.server + '/api/v2.1/dtables/share-links/';
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

  deleteDTableShareLink(token) {
    var url = this.server + '/api/v2.1/dtables/share-links/' + token + '/';
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

  listAPITokenStatus(workspaceID, name) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID +  '/dtable/' + name + '/api-tokens-status/';
    return this.req.get(url);
  }

  copyDTable(srcWorkspaceID, dstWorkspaceID, name) {
    let url = this.server + '/api/v2.1/dtable-copy/';
    let formData = new FormData();
    formData.append('src_workspace_id', srcWorkspaceID);
    formData.append('dst_workspace_id', dstWorkspaceID);
    formData.append('name', name);
    return this._sendPostRequest(url, formData);
  }

  copyExternalDtable(dstWorkspaceID, link) {
    let url = this.server + '/api/v2.1/dtable-external-link/dtable-copy/';
    let formData = new FormData();
    formData.append('link', link);
    formData.append('dst_workspace_id', dstWorkspaceID);
    return this._sendPostRequest(url, formData);
  }

  addExportExternalDTable(externalLinkToken, onDownloadProgress = null) {
    let url = this.server + '/dtable/external-links/'+ externalLinkToken +'/download-zip/';
    const _this = this;
    return this.req.get(url, {onDownloadProgress, responseType: 'blob', cancelToken: new axios.CancelToken(function executor(c) {
      _this.source = c;
    })})
  }

  cancelRequest() {
    return this.source();
  }

  addExportDTableTask(workspaceId, dtable_name) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/dtable/' + encodeURIComponent(dtable_name) + '/export-dtable/';
    return this.req.get(url);
  }

  addImportDTableTask (workspaceId, file) {
    const url = this.server + '/api/v2.1/workspace/' + workspaceId + '/import-dtable/';
    let formData = new FormData();
    formData.append('dtable', file);
    return this._sendPostRequest(url, formData);
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

  unstarDTable(dtable_uuid) {
    let url = this.server + '/api/v2.1/starred-dtables/?dtable_uuid=' + dtable_uuid;
    return this.req.delete(url);
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

  getUploadLinkViaFormToken(token) {
    let url = this.server + '/api/v2.1/forms/' + token + '/upload-link/';
    return this.req.get(url);
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

  submitFormData(token, table_id, row_data) {
    const url = this.server + '/api/v2.1/form-submit/' + token + '/';
    let form = new FormData();
    form.append('table_id', table_id);
    form.append('row_data', row_data);
    return this._sendPostRequest(url, form);
  }

  getDTableActivities(pageNum, avatarSize=36) {
    let url = this.server + '/api/v2.1/dtable-activities/?page=' + pageNum + '&avatar_size=' + avatarSize;
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

  listDTablePlugins(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/';
    return this.req.get(url);
  }
  
  uploadDTablePlugin(workspaceID, dtableName, formData, onUploadProgress = null) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/';
    return this.req.post(url, formData, {onUploadProgress});
  }
  
  deleteDTablePlugin(workspaceID, dtableName, pluginID) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/' + pluginID + '/';
    return this.req.delete(url);
  }
  
  updateDtablePlugin(workspaceID, dtableName, pluginID, formData, onUploadProgress) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/' + pluginID + '/';
    return this.req.put(url, formData, {onUploadProgress});
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

  listPluginsByExternalLink(token) {
    const url = this.server + '/api/v2.1/external-link-tokens/' + token + '/plugins/';
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
    let params = "?workspace_id=" + workspaceID + "&name=" + encodeURIComponent(tableName) + "&table_id=" + table_id + "&row_id=" + rowId; 
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

  // other not-admin APIs
  getUserInfo() {
    const url = this.server + '/api/v2.1/user/';
    return this.req.get(url);
  }

  getUserCommonInfo(email, avatarSize) {
    const url = this.server + '/api/v2.1/user-common-info/' + email;
    let params = {
      avatar_size: avatarSize
    };
    return this.req.get(url, {params: params});
  }

  getChargebeeCustomer() {
    const url = this.server + '/api/v2.1/chargebee/customer/';
    return this.req.get(url);
  }

  chargebeeCheckout(planID) {
    const url = this.server + '/api/v2.1/chargebee/checkout/';
    return this.req.post(url, { plan_id: planID });
  }

  listGroups(withRepos = false) {
    let options = {with_repos: withRepos ? 1 : 0};
    const url = this.server + '/api/v2.1/groups/';
    return this.req.get(url, {params: options});
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
    }
    return this.req.put(url, params);
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

  listGroupMembers(groupID, isAdmin=false, avatarSize=64) {
    let url = this.server + '/api/v2.1/groups/' + groupID + '/members/?avatar_size=' + avatarSize + '&is_admin=' + isAdmin;
    return this.req.get(url);
  }

  setGroupAdmin(groupID, userName, isAdmin) {
    let name = encodeURIComponent(userName);
    let url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
    const params = {
      is_admin: isAdmin
    }
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

  zipDTableAssetFiles(dtableUuid, files) {
    let url = this.server + '/api/v2.1/dtable-asset/' + dtableUuid  + '/zip-task/';
    if (!Array.isArray(files)) {
      files = [files];
    }
    let form = new FormData();
    files.map(item => {
      form.append('file', item);
    });
    return this._sendPostRequest(url, form);
  }

  listCommonDatasets(dst_dtable_uuid) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/';
    if (dst_dtable_uuid) {
      url = url + '?dst_dtable_uuid=' + dst_dtable_uuid;
    }
    return this.req.get(url);
  }

  getCommonDataset(datasetId) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/';
    return this.req.get(url);
  }

  createCommonDataset(datasetName, dtableName, tableName, viewName) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/';
    let formData = new FormData();
    formData.append('dataset_name', datasetName);
    formData.append('dtable_name', dtableName);
    formData.append('table_name', tableName);
    formData.append('view_name', viewName);
    return this._sendPostRequest(url, formData);
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

  syncCommonDataset(datasetId, dst_dtable_uuid, dst_table_id) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/' + datasetId + '/sync/';
    let formData = new FormData();
    formData.append('dst_dtable_uuid', dst_dtable_uuid);
    formData.append('dst_table_id', dst_table_id);
    return this._sendPostRequest(url, formData);
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
    }
    return this.req.get(url, {params: params});
  }

  updateNotifications() {
    const url = this.server + '/api/v2.1/notifications/';
    return this.req.put(url);
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

  updateEmailNotificationInterval(interval) {
    const url = this.server + '/api2/account/info/';
    const data = {
      'email_notification_interval': interval
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

  updateUserInfo({name, telephone, contact_email, list_in_address_book}) {
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
    return this.req.put(url, data);
  }

  updateWebdavSecret(password) {
    const url = this.server + '/api/v2.1/webdav-secret/';
    const data = {
      'secret': password
    };
    return this.req.put(url, data);
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
    return this.req.put(url, ruleJson,  { headers: { 'Content-type': 'application/json' }})
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

  orgAdminAddOrgUser(orgID, email, name, password) {
    const url =  this.server + '/api/v2.1/org/' + orgID +'/admin/users/';
    let form = new FormData();
    form.append('email', email);
    form.append('name', name);
    form.append('password', password);
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
    form.append('is_staff', isStaff)
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

  orgAdminListTrashDTables(orgID, page, perPage) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/trash-dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
  }

  orgAdminRestoreTrashDTable(orgID, dtableID) {
    const url = this.server + '/api/v2.1/org/' + orgID + '/admin/trash-dtables/' + dtableID + '/';
    return this.req.put(url);
  }

  orgAdminGetSettings() {
    const url = this.server + '/api/v2.1/org/admin/settings/';
    return this.req.get(url);
  }

  orgAdminUpdateSettings(key, value) {
    const url = this.server + '/api/v2.1/org/admin/settings/';
    let form = new FormData;
    form.append(key, value);
    return this.req.put(url, form);
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

  sysAdminRestoreTrashDTable(dtableID) {
    let url = this.server + '/api/v2.1/admin/trash-dtables/' + dtableID + '/';
    return this.req.put(url);
  }

  // sysadmin org api
  sysAdminListOrgs(page, per_page) {
    const url = this.server + '/api/v2.1/admin/organizations/';
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

  sysAdminListOrgUsers(orgID) {
    const url = this.server + '/api/v2.1/admin/organizations/' + orgID + '/users/';
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

  sysAdminSetUserQuotaInBatch(emails, quotaTotal) {
    const url = this.server + '/api/v2.1/admin/users/batch/';
    let formData = new FormData();
    emails.map(email => {
      formData.append('email', email);
    });
    formData.append('operation', 'set-quota');
    formData.append('quota_total', quotaTotal);
    return this._sendPostRequest(url, formData);
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

  sysAdminSearchUsers(query) {
    var url = this.server + '/api/v2.1/admin/search-user/';
    var params = {
      query: query
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

  sysAdminSetSysNotificationToCurrent(nid) {
      let url = this.server + '/api/v2.1/admin/sys-notifications/' + nid + '/';
      return this.req.put(url);
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

  sysAdminStatisticActiveUsers(startTime, endTime) {
    const url = this.server + '/api/v2.1/admin/statistics/active-users/';
    let params = {
      start: startTime,
      end: endTime,
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

  sysAdminUpdateFavicon(file) {
    let url = this.server + '/api/v2.1/admin/favicon/';
    let formData = new FormData();
    formData.append('favicon', file);
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
      params.wipe_device = wipeDevice
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

}

export default DTableWebAPI;
