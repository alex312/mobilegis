#引入webgis
引入webgis后，需要修改其中的plugins/maps/layers/ships/layers/ShiplayerShapeVts.js 中的projection.getPointResolution修改为projection.getPointResolutionFunc

# Cordova error :Current working directory is not a Cordova-based project.
从git上clone下来的项目，使用命令 ionic platform add andorid 时会出现错误“Current working directory is not a Cordova-based project.” 在项目根目录中创建www文件夹即可解决