var success = false
export function splid() {
  var $ = function(selector:any){
    return  document.querySelector(selector);
  }
  var box = $(".drag")
  var bg = $(".bg")
  var text = $(".text")
  var btn = $(".btn")
  var err = $(".errr")
  var distance = box.offsetWidth - btn.offsetWidth;
  btn.onmousedown = function(e:any){
    btn.style.transition = "";
    bg.style.transition ="";
    e = e || window.event;
    var downX = e.clientX;
    err.innerHTML=''
    document.onmousemove = function(e){
        e = e || window.event;
        var moveX = e.clientX;
        var offsetX = moveX - downX;
        if( offsetX > distance){
            offsetX = distance;
        }else if( offsetX < 0){
            offsetX = 0;
        }
        btn.style.left = offsetX + "px";
        bg.style.width = offsetX + "px";
        if( offsetX === distance){
            text.innerHTML = "验证通过";
            // text.style.color = "#fff";
            btn.style.color = "green";
            btn.style.background = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAiCAYAAAApkEs2AAACA0lEQVRYhe2Y2yuDYRzHv7PJYc5zKspYSRMymStXu5NCs5W4csEfwJ+gSA53csg1F4R/gSu0OcWSmNIQkfMcEvu9tdpY79793leo91Nbbft993x6nj2/52kal8v1gX+Ajp4sFstve4jidrsR99sSUlFFlUYVVRpVVGl0SnyJ934VaxczOLpdwd3bufBeWnw+StLrYc1tQ3FqnewxZIk+vz9g7rAHO9dL3z67efXBfTkrPCqymtBqGkaiNoU9FnvpSXJyzx5R8itUQ7WU4cIWnT/qhe9xS3I91VKGC0uUfpPbV4uSajUhQ1CGshxYorRxpGDObECf1Ysm40DM2a+wNhPt7mhUZzvhMI1Aq9HBkFgUUzYSrBkNtiDCkGBES/Eg8pLKwiSdplFB8uRhEzMH3RGzsSC7j9oKe1CT4wi0oEZMeRzITy4XJOM0WkFy2uOE//1O7jA8UWrm1CeJ5dMxlGXYoI/PQrd5AQlavagkZTmwlt4UOHGCnPs9wkw+vl0jSZcWdSZDsz8uas1tD3t99rSL8b0W3Lz4cHy/LrrctYEjlQNr6Y2ptag0NIf10gv/Pvo3akRzlOGe++yTyV4yhAJ9leR6qqUMF7YoXTC6zPPChSMaVEO1ci4lstoTDdxROhE4Fjv/9jUvCIkoISPGv7nhq6JKo4oqjSqqNEIfpf8f/zqf+36643RPeo8AAAAASUVORK5CYII=) no-repeat center center";
            btn.style.backgroundSize = "100% 100%";
            bg.style.backgroundColor = "lightgreen";
            success = true;
            btn.onmousedown = null;
            document.onmousemove = null;
        }
    }
    document.onmouseup = function(e){
        if(success){
            return;
        }else{
            btn.style.left = 0;
            bg.style.width = 0;
            btn.style.transition = "left 1s ease";
            bg.style.transition = "width 1s ease";
        }
        document.onmousemove = null;
        document.onmouseup = null;
    }
  }
}
export function slideFinishState(){
    return success
}
export function setErr(msg:string){
  var $ = function(selector:any){
    return  document.querySelector(selector);
  }
  var err = $(".errr")
  err.innerHTML=msg
}
export function resetSuccess(){
  success = false
}