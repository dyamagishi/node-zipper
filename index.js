const fs = require('fs')
const child_process = require('child_process')

// 対象フォルダ
const sourceDir = "PATH/TO/FOLDER"
// プロセス数
const cpuNum = 6

// フォルダのリスト
let folders = []

function createProc(){
    // リストから一つ取り出し
    let folder = folders[0]
    let filepath = sourceDir+"\\"+folder
    folders.shift()
    // プロセス生成
    cproc = child_process.fork("./child",null,{env:{filepath:filepath}})
    cproc.on("exit",()=>{
        // 子プロセス終了時、リストが残ってたらまた新たにプロセス生成
        if(folders.length>0){
            createProc()
        } else { 
            console.log("exit....")
        }
    })
}

function main() {
    // 対象フォルダ内にあるフォルダのリストを作成
    let allFiles = fs.readdirSync(sourceDir)
    folders = allFiles.filter((file)=>{
        return fs.statSync(sourceDir+"\\"+file).isDirectory()
    })
    // コア数ぶん子プロセス立ち上げ
    for(let i=0; i<cpuNum; i++){
        createProc()
    }
}

main()
