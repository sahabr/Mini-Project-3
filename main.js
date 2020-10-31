import BarChart from './barchart.js';


let type = document.querySelector('#group-by');

let select = document.querySelector('#group-by');
select.addEventListener('change',function(){
    type=this.value;
    loadData(type);
}); 

function loadData(type){
    Promise.all([
        d3.csv("companies.csv",d3.autoType),
        d3.csv("rounds.csv",d3.autoType),
        d3.csv("investments.csv",d3.autoType),
        d3.csv("acquisitions.csv",d3.autoType),
    ]).then(data=>{
        console.log(data);
        const barchart = BarChart(".chart-container1"); 
        barchart.update(data,type);
    })
}