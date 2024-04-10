import { Line, Vector3, CatmullRomCurve3, BufferGeometry, LineBasicMaterial } from 'three'

//Create a closed wavey loop
// const lookatCurve = new CatmullRomCurve3( [
// 	new Vector3( -16, 8, -8 ),
// 	new Vector3( -6, 0, -2 ),
// 	new Vector3( -5, -4 ,-2 ),
// 	new Vector3( -3, -8, -2 ),
// ] );
const lookatCurve = new CatmullRomCurve3( [
	new Vector3( -12, -2, 2 ),
	new Vector3( -6, 0, -2 ),
	new Vector3( -5, -4 ,-2 ),
	new Vector3( 2, -10, 2 ),
] );
const points = lookatCurve.getPoints( 50 );
const geometry = new BufferGeometry().setFromPoints( points );

const material = new LineBasicMaterial( { color: 'blue' } );

// Create the final object to add to the scene
const lookatPath = new Line( geometry, material );

export { lookatPath, lookatCurve };