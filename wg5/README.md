# WebGIS

--------------------------------------------------------------------------
## 开发配置
```shell
npm config set registry http://192.168.15.7:4873/
npm install -g asws typescript@rc typings gulp
npm install
typings install
```

## Setup IDE

### 1. WebStorm

In File -> Settings -> Languages & Frameworks -> TypeScript,
Check on "Enable TypeScript Compiler" and "Use tsconfig.json".

Set compiler version to "lib" folder under the globally install typescript npm module folder
(i.e. C:\Users\<user>\AppData\Roaming\npm\node_modules\typescript\lib).

## Run
```
asws --port <port>
```
Browse http://localhost:<port>/


## 开发约定

1. 文件夹名,使用Camel
	* 例如 User Manager 使用 userManager

2. 类名,Pascal
	* 例如 User Manager 使用 UserManager

3. 类成员:
	1. public的,使用Camel
	2. private,protected,使用Camel后接"_"
		* 例如 User Manager 使用 userManager_

	
	