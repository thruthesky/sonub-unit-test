export function isTrue( re, msg='' ) {
    if ( re === true ) success(msg);
    else failure(msg);
}


function success( msg ) {
    console.log("SUCCESS: ", msg);
}
function failure( msg ) {
    console.log("FAILURE: ", msg);
}