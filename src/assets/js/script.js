
let arr = [{type:"Fiat", model:"500", color:"white"},
 {type:"aaa", model:"sd3", color:"whdsd"} ];
console.log(arr[arr.length-1])

  
    arr?.map((item, index)=>{
      
    if(index===arr.length){
    console.log(item, " test");
    }
    })