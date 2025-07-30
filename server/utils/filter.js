/**
 @param {Array} array
 @param {string} filterBy
 @param {string} condition
 @param {number} value
 @returns {Array}
 @throws {Error}
 **/
const validConditions = [
    '=',
    '!=',
    '>',
    '<',
    '>=',
    '<='
]
const typeCheck = (array,filterBy,condition,value) =>{
    if (!Array.isArray(array)) {
        throw new TypeError('First argument must be an array');
    }
    if (filterBy && typeof filterBy !== 'string') {
        throw new TypeError('filterBy must be a string');
    }
    if (condition && !validConditions.includes(condition)) {
        throw new Error(`Invalid condition. Must be one of: ${validConditions.join(', ')}`);
    }
    if (value && typeof value !== 'number') {
        throw new TypeError('value must be a number');
    }
}




export const globalFilter = async (array,filterBy,condition,value) => {
    const formatedValue = Number(value)
    try {
        //type check
        await typeCheck(array,filterBy,condition,formatedValue);
        let formatedItem = 0;
        return array.filter(item => {
            if (filterBy)
                item = item[filterBy];
            formatedItem = Number(item);
            switch (condition) {
                case '=':
                    return item === formatedValue;
                case '!=':
                    return item !== formatedValue;
                case '>':
                    return item > formatedValue;
                case '<':
                    return item < formatedValue;
                case '>=':
                    return item >= formatedValue;
                case '<=':
                    return item <= formatedValue;
                default:
                    return  array
            }
        })
    }catch (error) {
        console.error('Error in globalFilter:', error);
        throw error;
    }

}


