import JSZip from 'jszip'
import FileSaver from 'file-saver'
 
export default function toZip(imgSrcList:any,fileName:any) {
	let zip = new JSZip();//实例化一个压缩文件对象
	let imgFolder:any = zip.folder(fileName); //新建一个图片文件夹用来存放图片，参数为文件名

		let src = imgSrcList;
		let tempImage = new Image();
		tempImage.src = src;
		tempImage.crossOrigin = "*";
		tempImage.onload = ()=> {
			imgFolder.file((fileName)+'.jpg', getBase64Image(tempImage).substring(22), { base64: true })
		}

	setTimeout(()=>{
		zip.generateAsync({ type: 'blob' }).then( function(content) {
			FileSaver.saveAs(content, 'images.zip')
		})
	},3000)
}
 
function getBase64Image(img:any) {
	let canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	let ctx:any = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
	let dataURL = canvas.toDataURL("image/"+ext);

	return dataURL;
}
