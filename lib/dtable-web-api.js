"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _formData = _interopRequireDefault(require("form-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DTableWebAPI =
/*#__PURE__*/
function () {
  function DTableWebAPI(_ref) {
    var server = _ref.server,
        username = _ref.username,
        password = _ref.password,
        token = _ref.token;

    _classCallCheck(this, DTableWebAPI);

    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;

    if (this.token && this.server) {
      this.req = _axios["default"].create({
        baseURL: this.server,
        headers: {
          'Authorization': 'Token ' + this.token
        }
      });
    }

    return this;
  }

  _createClass(DTableWebAPI, [{
    key: "login",
    value: function login() {
      var _this = this;

      var url = this.server + '/api2/auth-token/';
      return _axios["default"].post(url, {
        username: this.username,
        password: this.password
      }).then(function (response) {
        _this.token = response.data.token;
        _this.req = _axios["default"].create({
          baseURL: _this.server,
          headers: {
            'Authorization': 'Token ' + _this.token
          }
        });
      });
    }
  }, {
    key: "_sendPostRequest",
    value: function _sendPostRequest(url, form) {
      if (form.getHeaders) {
        return this.req.post(url, form, {
          headers: form.getHeaders()
        });
      } else {
        return this.req.post(url, form);
      }
    } //---- directory operation

  }, {
    key: "listDir",
    value: function listDir(repoID, dirPath) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$recursive = _ref2.recursive,
          recursive = _ref2$recursive === void 0 ? false : _ref2$recursive,
          _ref2$type = _ref2.type,
          type = _ref2$type === void 0 ? '' : _ref2$type,
          _ref2$with_thumbnail = _ref2.with_thumbnail,
          with_thumbnail = _ref2$with_thumbnail === void 0 ? false : _ref2$with_thumbnail,
          _ref2$with_parents = _ref2.with_parents,
          with_parents = _ref2$with_parents === void 0 ? false : _ref2$with_parents;

      /*
        * opts: `{recursive: true}`, `{'with_thumbnail': true}`
        */
      var url = this.server + '/api/v2.1/repos/' + repoID + '/dir/';
      var params = {};
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

      return this.req.get(url, {
        params: params
      });
    }
  }, {
    key: "listRepos",
    value: function listRepos(options) {
      /*
        * options: `{type: 'shared'}`, `{type: ['mine', 'shared', ...]}`
        */
      var url = this.server + '/api/v2.1/repos/';

      if (!options) {
        // fetch all types of repos
        return this.req.get(url);
      }

      return this.req.get(url, {
        params: options,
        paramsSerializer: function paramsSerializer(params) {
          var list = [];

          for (var key in params) {
            if (Array.isArray(params[key])) {
              for (var i = 0, len = params[key].length; i < len; i++) {
                list.push(key + '=' + encodeURIComponent(params[key][i]));
              }
            } else {
              list.push(key + '=' + encodeURIComponent(params[key]));
            }
          }

          return list.join('&');
        }
      });
    } //---- File Operation

  }, {
    key: "getFileInfo",
    value: function getFileInfo(repoID, filePath) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/detail/?p=' + path;
      return this.req.get(url);
    }
  }, {
    key: "getInternalLink",
    value: function getInternalLink(repoID, filePath, direntType) {
      var isDir = direntType === 'dir' ? true : false;
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/smart-link/?repo_id=' + repoID + '&path=' + path + '&is_dir=' + isDir;
      return this.req.get(url);
    }
  }, {
    key: "uploadImage",
    value: function uploadImage(uploadLink, formData) {
      var onUploadProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return _axios["default"].create()({
        method: "post",
        data: formData,
        url: uploadLink,
        onUploadProgress: onUploadProgress
      });
    } // workspace api

  }, {
    key: "listWorkspaces",
    value: function listWorkspaces() {
      var url = this.server + '/api/v2.1/workspaces/';
      return this.req.get(url);
    } // has been deleted
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

  }, {
    key: "listSharedTables",
    value: function listSharedTables() {
      var url = this.server + '/api/v2.1/dtables/shared/';
      return this.req.get(url);
    } // ---- dTable api

  }, {
    key: "createTable",
    value: function createTable(name, owner) {
      var url = this.server + '/api/v2.1/dtables/';
      var form = new _formData["default"]();
      form.append('name', name);
      form.append('owner', owner);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: "renameTable",
    value: function renameTable(workspaceID, old_name, new_name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
      var form = new _formData["default"]();
      form.append('old_name', old_name);
      form.append('new_name', new_name);
      return this.req.put(url, form);
    }
  }, {
    key: "deleteTable",
    value: function deleteTable(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/';
      var params = {
        name: name
      };
      return this.req["delete"](url, {
        data: params
      });
    }
  }, {
    key: "listTableShares",
    value: function listTableShares(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
      return this.req.get(url);
    }
  }, {
    key: "addTableShare",
    value: function addTableShare(workspaceID, name, email, permission) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
      var params = {
        email: email,
        permission: permission
      };
      return this.req.post(url, params);
    }
  }, {
    key: "deleteTableShare",
    value: function deleteTableShare(workspaceID, name, email) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
      var params = {
        email: email
      };
      return this.req["delete"](url, {
        data: params
      });
    }
  }, {
    key: "updateTableShare",
    value: function updateTableShare(workspaceID, name, email, permission) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/share/';
      var params = {
        email: email,
        permission: permission
      };
      return this.req.put(url, params);
    }
  }, {
    key: "getDTableShareLink",
    value: function getDTableShareLink(workspaceID, name) {
      var url = this.server + '/api/v2.1/dtables/share-links/?workspace_id=' + workspaceID + '&table_name=' + name;
      return this.req.get(url);
    }
  }, {
    key: "createDTableShareLink",
    value: function createDTableShareLink(workspaceID, name, password, expireDays, permissions) {
      var url = this.server + '/api/v2.1/dtables/share-links/';
      var form = new _formData["default"]();
      form.append('workspace_id', workspaceID);
      form.append('table_name', name);

      if (permissions) {
        form.append('permissions', permissions);
      }

      if (password) {
        form.append('password', password);
      }

      if (expireDays) {
        form.append('expire_days', expireDays);
      }

      return this._sendPostRequest(url, form);
    }
  }, {
    key: "deleteDTableShareLink",
    value: function deleteDTableShareLink(token) {
      var url = this.server + '/api/v2.1/dtables/share-links/' + token + '/';
      return this.req["delete"](url);
    }
  }, {
    key: "listTableAPITokens",
    value: function listTableAPITokens(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/';
      return this.req.get(url);
    }
  }, {
    key: "addTableAPIToken",
    value: function addTableAPIToken(workspaceID, name, appName, permission) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/';
      var params = {
        app_name: appName,
        permission: permission
      };
      return this.req.post(url, params);
    }
  }, {
    key: "updateTableAPIToken",
    value: function updateTableAPIToken(workspaceID, name, appName, permission) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/' + encodeURIComponent(appName) + '/';
      var params = {
        permission: permission
      };
      return this.req.put(url, params);
    }
  }, {
    key: "deleteTableAPIToken",
    value: function deleteTableAPIToken(workspaceID, name, appName) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/api-tokens/' + encodeURIComponent(appName) + '/';
      return this.req["delete"](url);
    } // ---- dtable data api

  }, {
    key: "getTableDownloadLink",
    value: function getTableDownloadLink(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/?name=' + encodeURIComponent(name) + '&reuse=1';
      return this.req.get(url);
    }
  }, {
    key: "getTableUpdateLink",
    value: function getTableUpdateLink(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable-update-link/?name=' + encodeURIComponent(name);
      return this.req.get(url);
    }
  }, {
    key: "getTableAccessToken",
    value: function getTableAccessToken(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/access-token/';
      return this.req.get(url);
    }
  }, {
    key: "getTableRelatedUsers",
    value: function getTableRelatedUsers(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable/' + encodeURIComponent(name) + '/related-users/';
      return this.req.get(url);
    }
  }, {
    key: "getTableAssetUploadLink",
    value: function getTableAssetUploadLink(workspaceID, name) {
      var url = this.server + '/api/v2.1/workspace/' + workspaceID + '/dtable-asset-upload-link/?name=' + encodeURIComponent(name);
      return this.req.get(url);
    }
  }, {
    key: "getTableRowShareLink",
    value: function getTableRowShareLink(workspaceID, tableName, table_id, rowId) {
      var params = "?workspace_id=" + workspaceID + "&name=" + encodeURIComponent(tableName) + "&table_id=" + table_id + "&row_id=" + rowId;
      var url = this.server + '/api/v2.1/dtable-row-shares/' + params;
      return this.req.get(url);
    }
  }, {
    key: "createTableRowShareLink",
    value: function createTableRowShareLink(workspaceID, tableName, table_id, rowId) {
      var url = this.server + '/api/v2.1/dtable-row-shares/';
      var form = new _formData["default"]();
      form.append('workspace_id', workspaceID);
      form.append('name', tableName);
      form.append('table_id', table_id);
      form.append('row_id', rowId);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: "deleteTableRowShareLink",
    value: function deleteTableRowShareLink(token) {
      var url = this.server + '/api/v2.1/dtable-row-shares/' + token + '/';
      this.req["delete"](url);
    }
  }, {
    key: "listRecentAddedFiles",
    value: function listRecentAddedFiles(days) {
      var url = this.server + '/api/v2.1/recent-added-files/';

      if (days) {
        url = url + '?days=' + days;
      }

      return this.req.get(url);
    }
  }]);

  return DTableWebAPI;
}();

var _default = DTableWebAPI;
exports["default"] = _default;