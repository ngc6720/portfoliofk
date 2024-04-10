import { Line, Vector3, CatmullRomCurve3, BufferGeometry, LineBasicMaterial } from 'three'

//Create a closed wavey loop
// const curve = new CatmullRomCurve3( [
// 	new Vector3( -2, 5, 1 ),
// 	new Vector3( -1, 3, 1.2 ),
// 	new Vector3( 1, -2 ,0.9 ),
// 	new Vector3( 5, -4, 0.8 ),
// ] );
const curve = new CatmullRomCurve3( [
	new Vector3( 2,5 , 0.8 ),
	new Vector3( -1, 3, 1.2 ),
	new Vector3( 1, -2 ,0.9 ),
	new Vector3( 5, -3, 4 ),
] );
const points = curve.getPoints( 50 );
const geometry = new BufferGeometry().setFromPoints( points );

const material = new LineBasicMaterial( { color: 'red' } );

// Create the final object to add to the scene
const path = new Line( geometry, material );

export { path, curve };