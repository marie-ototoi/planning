const d3 = require('d3')


const addIcalStream = function addIcalStream(element){
    //
    
}

console.log('bonjour')

d3.select('.add_cal').on('click', function(e, index, elements) {
       	let fieldset = this.parentNode
       	let form = fieldset.parentNode
       	//console.log(elements[0])
       	form.insertBefore(fieldset.cloneNode(true), fieldset)

        //return false
    }, false)


module.exports = this