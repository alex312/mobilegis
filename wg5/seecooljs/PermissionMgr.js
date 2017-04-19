if( !('Permission' in window) ) window['Permission'] = {}
var UserInfo;
var UserPermission;
var UserSetting;
Permission.SetUser = function(user) {
    UserInfo = user;
    var storage = window.localStorage;
    storage["User"] = JSON.stringify(UserInfo);
}

Permission.GetUser = function(){
    if(!UserInfo){
        var t=window.localStorage["User"];
        t=t||"null"
        UserInfo = JSON.parse(t);
    }
    return UserInfo;
}

Permission.SetPermission = function(permission) {
    UserPermission = permission;
    var storage = window.localStorage;
    storage["UserPermission"] = JSON.stringify(UserPermission);
}

Permission.GetPermission = function() {
    //return true;
    if(!UserPermission) {
        var t = window.localStorage["UserPermission"];
        t = t || "{}"
        UserPermission=JSON.parse(t);
    }
    return UserPermission;
}

Permission.HavePermission = function(key){
    //return true;
    if(!UserPermission) {
        var t = window.localStorage["UserPermission"];
        t = t || "{}"
        UserPermission=JSON.parse(t);
    }
    return UserPermission[key];
}

Permission.SetSetting = function(setting) {
    UserSetting = setting;
    var storage = window.localStorage;
    storage["UserSetting"] = JSON.stringify(UserSetting);
}

Permission.GetSetting = function() {
    if(!UserSetting) {
        var t = window.localStorage["UserSetting"];
        t = t || "{}"
        UserSetting = JSON.parse(t);
    }
    return UserSetting;
}

Permission.Clear =function(){
    var storage = window.localStorage;
    delete storage["UserSetting"];
    delete storage["UserSettingObject"];
    delete storage["UserPermission"];
    delete storage["User"];
}

Permission.UpLoadSetting = function(){
    var storage = window.localStorage;
    storage["UserSetting"]=JSON.stringify(UserSetting);
    var userId=UserInfo.Id||"";
    var setting =storage["UserSetting"];
    var sto=storage["UserSettingObject"]||"{}";
    sto=JSON.parse(sto);
    if(sto.Id){
        return $.ajax({
            url: "api/UserConfigData?Id="+sto.Id,
            type: "put",
            data: {
                Id: sto.Id,
                UserId: userId,
                Category: "Webgis5_UserSetting",
                Content: setting
            }
        })
    }
    else{
        return $.ajax({
            url: "api/UserConfigData",
            type: "post",
            data: {
                Id: 0,
                UserId: userId,
                Category: "Webgis5_UserSetting",
                Content: setting
            }
        }).done(function(data,state){
            storage["UserSettingObject"] = JSON.stringify(data);
        })
        .fail(function(data,state){
            console.error(data);
        })
    }
}

Permission.defaultPermission= {
    test: {//开发测试人员(所有功能均可用可能会导致有些功能不正常)
        plotMenuLink: true,
        thhjMenuLink: true,
        userMenuLink: true,
        loginMenuLink: true,
        registerMenuLink: true,
        logoutMenuLink: true
    },
    user: {//已经登录的用户
        plotMenuLink: true,
        thhjMenuLink: true,
        userMenuLink: true,
        logoutMenuLink: true,
        measureMenuLink: true,
        menureCancal: true,
        menureLength: true,
        menureArea: true

    },
    guest:{//未登录用户

    },
    normalUser:{
        pudongVTS:true
    },
    marineUser:{
        userManager:true,
        pudongVTSMarine:true
    },
    fujianAdmin:{
        userManager:true
    },
    fujianDeclare:{
        declare:true,
    },
    fujianWaterWork:{
        waterwork:true,
    }
}