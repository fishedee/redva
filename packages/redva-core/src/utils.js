export isPlainObject from 'is-plain-object';
export const isArray = Array.isArray.bind(Array);
export const isFunction = o => typeof o === 'function';
export const returnSelf = m => m;
export const noop = () => {};
export const resetType = (str)=>{
	const strList = str.split("/");
	const newStrList = [];
	for( let i in strList ){
		if( strList[i] != ""){
			newStrList.push(strList[i]);
		}
	}
	return newStrList.join("/");
}
