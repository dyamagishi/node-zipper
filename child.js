const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

// source: アーカイブ化したいフォルダのパス
// dest: 生成したいzipファイルのパス
function zipFolder(source, dest){
    if(fs.existsSync(source + "/error.txt")){
        console.log("ihave error.txt, end.")
        return
    }
    var archive = archiver.create( 'zip', {zlib: { level: 5 }} )

    var output = fs.createWriteStream( dest );

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
    });

    archive.pipe(output)

    //ファイルをどんどんついかする
    let allFiles = fs.readdirSync(source)

    for(file of allFiles){
        //console.log("[file Name] "+file);
        let stat = fs.statSync(source+"\\"+file)
        if(stat.isFile()){
            archive.file(source+"\\"+file,{name: file})
        }
        if(stat.isDirectory()){
            archive.directory(source+"\\"+file, file)
        }
    }

    archive.finalize();
}

let dest = process.env.filepath + ".zip"
zipFolder(process.env.filepath, dest)
console.log(path.basename(process.env.filepath))
