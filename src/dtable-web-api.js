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

  listSharedTables() {
    let url = this.server + '/api/v2.1/dtables/shared/';
    return this.req.get(url);
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

  getDTableShareLink(workspaceID, name) {
    var url = this.server + '/api/v2.1/dtables/share-links/?workspace_id=' + workspaceID + '&table_name=' + name;
    return this.req.get(url);
  }

  createDTableShareLink(workspaceID, name, permission) {
    let url = this.server + '/api/v2.1/dtables/share-links/';
    let form = new FormData();
    form.append('workspace_id', workspaceID);
    form.append('table_name', name);

    if (permission) {
      form.append('permission', permission);
    }

    return this._sendPostRequest(url, form);
  }

  deleteDTableShareLink(token) {
    var url = this.server + '/api/v2.1/dtables/share-links/' + token + '/';
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

  getTableAccessTokenByShareLink(token) {
    const url = this.server + '/api/v2.1/dtable/share-link-access-token/' + '?token=' + token;
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
    const url = this.server + '/api/v2.1/dtable-form-submit/' + token + '/';
    let form = new FormData();
    form.append('table_id', table_id);
    form.append('row_data', row_data);
    return this._sendPostRequest(url, form);
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

  //account api

  getAccountInfo() {
    const url =  this.server + '/api2/account/info/';
    return this.req.get(url);
  }

  sysAdminListAllDTables(page, perPage) {
    const url = this.server + '/api/v2.1/admin/dtables/';
    let params = {
      page: page,
      per_page: perPage
    };
    return this.req.get(url, {params: params});
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

  // sysadmin org api
  sysAdminListOrgs() {
    const url = this.server + '/api/v2.1/admin/organizations/';
    return this.req.get(url);
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
    return this.req.put(url, formData);
  }

  sysAdminAddOrg(orgName, ownerEmail, owner_password) {
    const url = this.server + '/api/v2.1/admin/organizations/';
    let formData = new FormData();
    formData.append('org_name', orgName);
    formData.append('owner_email', ownerEmail);
    formData.append('owner_password', owner_password);
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

  listForms() {
    let url = this.server + '/api/v2.1/forms/';
    return this.req.get(url);
  }

  listDTableForms(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/dtable-forms?workspace_id=' + workspaceID + '&name='+ encodeURIComponent(dtableName);
    return this.req.get(url);
  }

  createDTableForm(workspaceID, dtableName, formID, formConfig) {
    let url = this.server + '/api/v2.1/dtable-forms/';
    let formData = new FormData();
    formData.append('workspace_id', workspaceID);
    formData.append('name', dtableName);
    formData.append('form_id', formID);
    formData.append('form_config', formConfig);
    return this._sendPostRequest(url, formData);
  }

  deleteDTableForm(token) {
    let url = this.server + '/api/v2.1/dtable-forms/' + token + '/';
    return this.req.delete(url);
  }

  updateDTableForm(token, formConfig, groupIDs) {
    let url = this.server + '/api/v2.1/dtable-forms/' + token + '/';
    let formData = new FormData();
    formData.append('form_config', formConfig);
    formData.append('group_ids', groupIDs);
    return this.req.put(url, formData);
  }

  getUploadLinkViaFormToken(token) {
    let url = this.server + '/api/v2.1/dtable-forms/' + token + '/upload-link/';
    return this.req.get(url);
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

  listDTablePlugins(workspaceID, dtableName) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/';
    return this.req.get(url);
  }
  
  uploadDTablePlugin(workspaceID, dtableName, formData) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/';
    return this._sendPostRequest(url, formData);
  }
  
  deleteDTablePlugin(workspaceID, dtableName, pluginID) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/' + pluginID + '/';
    return this.req.delete(url);
  }
  
  updateDtablePlugin(workspaceID, dtableName, pluginID, formData) {
    let url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(dtableName) + '/plugins/' + pluginID + '/';
    return this.req.put(url, formData);
  }

  listCommonDatasets(fromTableID) {
    let url = this.server + '/api/v2.1/dtable/common-datasets/';
    if (fromTableID) {
      url = url + '?from_table_id=' + fromTableID;
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

}

export default DTableWebAPI;
