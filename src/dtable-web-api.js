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

  //---- directory operation
  listDir(repoID, dirPath, { recursive = false, type = '', with_thumbnail = false, with_parents = false } = {}) {
    /*
      * opts: `{recursive: true}`, `{'with_thumbnail': true}`
      */
    const url = this.server + '/api/v2.1/repos/' + repoID + '/dir/';
    let params = {};
    params.p = dirPath;
    if (recursive) {
      params.recursive = recursive ? 1 : 0;
    }
    if (type) {
      params.t = type;
    }
    if (with_thumbnail) {
      params.with_thumbnail = with_thumbnail;
    }
    if (with_parents) {
      params.with_parents = with_parents;
    }
    return this.req.get(url, {params: params});
  }

  listRepos(options) {
    /*
      * options: `{type: 'shared'}`, `{type: ['mine', 'shared', ...]}`
      */
    let url = this.server + '/api/v2.1/repos/';

    if (!options) {
      // fetch all types of repos
      return this.req.get(url);
    }

    return this.req.get(url, {
      params: options,
      paramsSerializer: function(params) {
        let list = [];
        for (let key in params) {
          if (Array.isArray(params[key])) {
            for (let i = 0, len = params[key].length; i < len; i++) {
              list.push(key + '=' + encodeURIComponent(params[key][i]));
            }
          } else {
            list.push(key + '=' + encodeURIComponent(params[key]));
          }
        }
        return list.join('&');
      }
    });
  }

  //---- File Operation
  getFileInfo(repoID, filePath) {
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api2/repos/' + repoID + '/file/detail/?p=' + path;
    return this.req.get(url);
  }

  getInternalLink(repoID, filePath, direntType) {
    let isDir = direntType === 'dir' ? true : false;
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api/v2.1/smart-link/?repo_id=' + repoID + '&path=' + path + '&is_dir=' + isDir;
    return this.req.get(url);
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

  createDTableShareLink(workspaceID, name, password, expireDays, permission) {
    var url = this.server + '/api/v2.1/dtables/share-links/';
    var form = new FormData();
    form.append('workspace_id', workspaceID);
    form.append('table_name', name);
    if (permission) {
      form.append('permission', permission);
    }
    if (password) {
      form.append('password', password);
    }
    if (expireDays) {
      form.append('expire_days', expireDays);
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

}

export default DTableWebAPI;
