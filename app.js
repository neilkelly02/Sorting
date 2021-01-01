let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cLength = canvas.height;
let array=[];
let isSorting=false;
let colorpallette='RB';
let delay=1;
let n=50;
let g=0;
let w;
let option;

function initialArray(){
    setTimeout(generateArray(),2000);
}
function checkTheme() {
    let rbs = document.querySelectorAll('input[name="theme"]');
    let letters=document.getElementsByClassName("letter")
    let buttons=document.querySelectorAll('button[name="button"]');
    let sliders = document.querySelectorAll('input[class="slider"]');
    let style = document.createElement('style');
    style.setAttribute("id","style")
    let head = document.head || document.getElementsByTagName('head')[0];

    head.appendChild(style);
    for (let rb of rbs) {
        if (rb.checked) {
            colorpallette = rb.value;
            if( colorpallette=='RB'){
                for (let letter of letters){
                    letter.style.color=heightToRGB2(cLength);
                }
                for (let button of buttons) {
                    button.style.backgroundColor=heightToRGB2(cLength*4.2/5);
                    button.style.color="white";
                }
                for (let slider of sliders){
                    slider.style.backgroundColor=heightToRGB(cLength*4.2/5);
                }
                let cssText = `input.slider::-webkit-slider-thumb {
                    background-color: ${heightToRGB2(cLength*1.1/6)};
                  } input[type='radio']:checked:after {
                    background-color: ${heightToRGB(cLength*4.2/5)};
                  }`;;
                  if (style.styleSheet){
                    style.styleSheet.cssText = cssText;
                  } else {
                    style.innerHTML="";
                    style.appendChild(document.createTextNode(cssText));
                  }
            }
            else {
                for (let letter of letters){
                    letter.style.color=heightToRGB(cLength/2);
                }
                for (let button of buttons) {
                    button.style.backgroundColor=heightToRGB(cLength/2);
                    button.style.color="black";
                }
                for (let slider of sliders){
                    slider.style.backgroundColor=heightToRGB(cLength/2);
                }
                let cssText = `input.slider::-webkit-slider-thumb {
                    background-color: ${heightToRGB(cLength*1.2)};
                  }input[type='radio']:checked:after {
                    background-color: ${heightToRGB(cLength/2)};
                  };`;
                  if (style.styleSheet){
                    style.styleSheet.cssText = cssText;
                  } else {
                    style.innerHTML="";
                    style.appendChild(document.createTextNode(cssText));
                  }
            }
            break;
        }
    }
           
}


function generateArray(){
    optionChecker();
    clearCanvas();
    isSorting=false;
    array=[];
    w = cWidth-n*g-g;
    w=w/n;
    let scale=canvas.height/n;
    for (let i = 1; i <= n; i++){
        array.push(Math.floor(i*scale));
    }
    array.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < n; i++){
        ctx.fillStyle = heightToRGB(array[i]);
        ctx.fillRect(i*(w+g)+g,cLength-array[i]+2,w,array[i]);
        ctx.strokeRect(i*(w+g)+g,cLength-array[i]+2,w,array[i]);
    }
}

function updateArray(a, b,c,d,e){
    clearCanvas();
    for (let i = 0; i < n; i++){
        if (isSorting==true){
            if (i==a||i==b){
                ctx.fillStyle ="black";
            }
            else if(i==d||i==e||i==c){
                if(i==c){
                    ctx.fillStyle="yellow";
                }
                else {
                    ctx.fillStyle="white";
                }    
            }  
            else {
                ctx.fillStyle =heightToRGB(array[i]);
            }
        }
        else {
            ctx.fillStyle =heightToRGB(array[i]);
        }
        ctx.fillRect(i*(w+g)+g,cLength-array[i]+2,w,array[i]);
        ctx.strokeRect(i*(w+g)+g,cLength-array[i]+2,w,array[i]);
    }
}

function clearCanvas(){
    // ctx.fillStyle ="#FFFFFF";
    // ctx.fillRect(0,0,640,260);
    ctx.clearRect(0,0,cWidth,cLength);
}


function optionChecker(){
    option=document.getElementById("SortMethod").value;
}

async function sortArray(){
    optionChecker();
    isSorting=true;
    
    if (option=="B"){
        await bubbleSort();
    }
    else if (option=="Q"){
        await quickSort(0,array.length-1);
    }
    else if (option=="S"){
        await selectionSort();
    }
    else if (option=="I"){
        await insertionSort();
    }
    else if (option=="M"){
        await mergeSort(0,array.length-1);
    }
    isSorting=false;
    updateArray();
}

async function insertionSort(){
    for(let i=0;i<array.length;i++){
        for(let j=i;j>=-1;j--){
            if(array[i]>array[j]||j==-1){
                let temp=array[i];
                for(let k=i-1;k>=j;k--){
                    array[k+1]=array[k];
                }
                array[j+1]=temp;
                break;
            }
            updateArray(i,j);
            await timer(delay); 
        }
    }
}

async function selectionSort(){
    for (let i=0;i<array.length;i++){
        let isSmallest=cLength+1;
        let smallIndex=i;
        for (let j=i;j<array.length;j++){
            if (array[j]<isSmallest){
                isSmallest=array[j];
                smallIndex=j;
            }
            updateArray(smallIndex,j);
            await timer(delay); 
        }   
        for (let k=smallIndex;k>i;k--){
            array[k]=array[k-1];
        }
        array[i]=isSmallest;
    }
}

async function quickSort(l,r){
    // let qArray=array;
    if (l>=r) return;
    let a =array[l];
    let b=array[r];
    let c =array[Math.floor((l+r)/2)];
    let pValue=(a+b+c-Math.max(a,b,c)-Math.min(a,b,c));
    let pIndex;
    if (pValue==a) pIndex = l;
    else if (pValue==b) pIndex = r;
    else pIndex = Math.floor((l+r)/2);
    array[pIndex]=array[r];
    array[r]=pValue;
    let i=l;
    let j=r-1;
    while (i<=j){
        while (array[i]<pValue){
            i++;
            await timer(delay);
            updateArray(i,j,pIndex,l,r);  
        }
        while(array[j]>pValue){
            j--;
            await timer(delay);
            updateArray(i,j,pIndex,l,r);  
        }
        if (i<j){
            temp= array[j];
            array[j]=array[i];
            array[i]=temp;
            i++;
            j--;
        }
        await timer(delay);
        updateArray(i,j,pIndex,l,r); 
        
         
    }
    temp= array[i];
    array[i]=array[r];
    array[r]=temp;
    await quickSort(l,i-1);
    await quickSort(i+1,r);
}

/*
Runtime of O(n^2) -> double for loop 
*/
async function bubbleSort(){
    for(let j=0;j<array.length-1;j++){
        for (let i = 0; i < array.length-1-j; i++){  
                if (array[i]>array[i+1]){
                    let temp=array[i];
                    array[i]=array[i+1];
                    array[i+1]=temp;  
                }
            await timer(delay);
            updateArray(i,i+1);
        }
    }
    updateArray();
}


async function mergeSort(l,r){
    if(l<r){   
        const c=Math.floor((l+r)/2);
        await mergeSort(l,c);
        await mergeSort(c+1,r);
        await merge(l,c,r);    
    }
    // await merge(0,0,1);   
    // await merge(2,2,3);
    // await merge(0,1,3);
}

async function merge(l,c,r){
    let tempArray=[r-l+1];
    let i=l;
    let j=c+1;
    let count=0;
    while(j <= r&&i <= c){
        if(array[i]<array[j]){
            tempArray[count]=  array[i]; 
            i++;
        }
        else {
            tempArray[count]=  array[j]; 
            j++;
        }
        count++;
    }
    if(!(j<=r)){
        for (let a=i;a<=c;a++){
            tempArray[count+a-i]=array[a];
        }
    }
    else if(!(i<=c)){
        for (let b=j;b<=r;b++){
            tempArray[count+b-j]=array[b];}
    }
    for (let d=l;d<=r;d++){
        array[d]=tempArray[d-l];
        
    }
    await timer(delay);
    updateArray(l,r);
}


function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

 
function heightToRGB(numHeight){
    let cv1 = Math.abs(230*(Math.sin((numHeight/cLength)*Math.PI/3+Math.PI/3)));
    let cv2 = Math.abs(230*(Math.sin(numHeight/cLength)*Math.PI/3));
    let cv3 = Math.abs(230*(Math.cos(((numHeight/cLength)*Math.PI/3-Math.PI/3))));
    if( colorpallette=='RB'){
        return heightToRGB2(numHeight);
    }
    else if (colorpallette=='CC'){
        R=cv1;
        G=cv2;
        B=cv3;
    }
    else if(colorpallette=='DS'){
        R=cv1;
        B=cv2;
        G=cv3;
    }
    else if (colorpallette=='GA'){
        G=cv1;
        B=cv2;
        R=cv3;
    }
    else if (colorpallette=='OS'){
        G=cv1;
        R=cv2;
        B=cv3;
    }
    else if (colorpallette=='PI'){
        B=cv1;
        G=cv2;
        R=cv3;
    }
    let decColor =0x1000000+ Math.round(B) + 0x100 * Math.round(G) + 0x10000 *Math.round(R) ;
    return '#'+decColor.toString(16).substr(1);
}


function heightToRGB2(numHeight){
    var h = numHeight;
    var s = 150;
    var v = 200;
    let R ;
    let G ;
    let B ;
        if (s == 0) {

        R = G = B = v;
        } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;
        
            if (h == 360) h = 0;

                if (h < 60) { R = t1; B = t2; G = t2 + t3 }
                else if (h < 120) { G = t1; B = t2; R = t1 - t3 }
                else if (h < 180) { G = t1; R = t2; B = t2 + t3 }
                else if (h < 240) { B = t1; R = t2; G = t1 - t3 }
                else if (h < 300) { B = t1; G = t2; R = t2 + t3 }
                else if (h < 360) { R = t1; G = t2; B = t1 - t3 }
                else { R = 0; G = 0; B = 0 }
        }
        let decColor =0x1000000+ Math.round(B) + 0x100 * Math.round(G) + 0x10000 *Math.round(R);
        return '#'+decColor.toString(16).substr(1);
    

}


var numberSlider = document.getElementById("numberSlider");

numberSlider.oninput = function() {
  n=this.value;
  isSorting=false;
  generateArray();
}

var gapSlider = document.getElementById("gapSlider");

gapSlider.oninput = function() {
    g = Math.round(this.value);
    w = cWidth-n*g-g;
    w=w/n;
    updateArray();
}
var delaySlider = document.getElementById("delaySlider");

delaySlider.oninput = function() {
    delay=this.value;
    updateArray();
}



// function playSound(url){
//     new Audio(url).play();
// }

/* 
QuickSort

Insertion Sort

Bubble Sort

Selection Sort

Binary Sort

Counting Sort
a
*/




