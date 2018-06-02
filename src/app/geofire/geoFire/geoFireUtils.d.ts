import * as firebase from 'firebase';
import { GeoFireObj } from './interfaces';
export declare const g_GEOHASH_PRECISION: number;
export declare const g_BASE32: string;
export declare const g_EARTH_MERI_CIRCUMFERENCE: number;
export declare const g_METERS_PER_DEGREE_LATITUDE: number;
export declare const g_BITS_PER_CHAR: number;
export declare const g_MAXIMUM_BITS_PRECISION: number;
export declare const g_EARTH_EQ_RADIUS: number;
export declare const g_E2: number;
export declare const g_EPSILON: number;
/**
 * Validates the inputted key and throws an error if it is invalid.
 *
 * @param key The key to be verified.
 */
export declare function validateKey(key: string): void;
/**
 * Validates the inputted location and throws an error if it is invalid.
 *
 * @param location The [latitude, longitude] pair to be verified.
 */
export declare function validateLocation(location: number[]): void;
/**
 * Validates the inputted geohash and throws an error if it is invalid.
 *
 * @param geohash The geohash to be validated.
 */
export declare function validateGeohash(geohash: string): void;
/**
 * Validates the inputted query criteria and throws an error if it is invalid.
 *
 * @param newQueryCriteria The criteria which specifies the query's center and/or radius.
 * @param requireCenterAndRadius The criteria which center and radius required.
 */
export declare function validateCriteria(newQueryCriteria: any, requireCenterAndRadius?: boolean): void;
/**
 * Converts degrees to radians.
 *
 * @param degrees The number of degrees to be converted to radians.
 * @returns The number of radians equal to the inputted number of degrees.
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * Generates a geohash of the specified precision/string length from the  [latitude, longitude]
 * pair, specified as an array.
 *
 * @param location The [latitude, longitude] pair to encode into a geohash.
 * @param precision The length of the geohash to create. If no precision is specified, the
 * global default is used.
 * @returns The geohash of the inputted location.
 */
export declare function encodeGeohash(location: number[], precision?: number): string;
/**
 * Calculates the number of degrees a given distance is at a given latitude.
 *
 * @param distance The distance to convert.
 * @param latitude The latitude at which to calculate.
 * @returns The number of degrees the distance corresponds to.
 */
export declare function metersToLongitudeDegrees(distance: number, latitude: number): number;
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a
 * given latitude.
 *
 * @param resolution The desired resolution.
 * @param latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */
export declare function longitudeBitsForResolution(resolution: number, latitude: number): number;
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 *
 * @param resolution The bits necessary to reach a given resolution, in meters.
 * @returns Bits necessary to reach a given resolution, in meters, for the latitude.
 */
export declare function latitudeBitsForResolution(resolution: number): number;
/**
 * Wraps the longitude to [-180,180].
 *
 * @param longitude The longitude to wrap.
 * @returns longitude The resulting longitude.
 */
export declare function wrapLongitude(longitude: number): number;
/**
 * Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a
 * given size at the given coordinate.
 *
 * @param coordinate The coordinate as a [latitude, longitude] pair.
 * @param size The size of the bounding box.
 * @returns The number of bits necessary for the geohash.
 */
export declare function boundingBoxBits(coordinate: number[], size: number): number;
/**
 * Calculates eight points on the bounding box and the center of a given circle. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 *
 * @param center The center given as [latitude, longitude].
 * @param radius The radius of the circle.
 * @returns The eight bounding box points.
 */
export declare function boundingBoxCoordinates(center: number[], radius: number): number[][];
/**
 * Calculates the bounding box query for a geohash with x bits precision.
 *
 * @param geohash The geohash whose bounding box query to generate.
 * @param bits The number of bits of precision.
 * @returns A [start, end] pair of geohashes.
 */
export declare function geohashQuery(geohash: string, bits: number): string[];
/**
 * Calculates a set of queries to fully contain a given circle. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param center The center given as [latitude, longitude] pair.
 * @param radius The radius of the circle.
 * @return An array of geohashes containing a [start, end] pair.
 */
export declare function geohashQueries(center: number[], radius: number): string[][];
/**
 * Encodes a location and geohash as a GeoFire object.
 *
 * @param location The location as [latitude, longitude] pair.
 * @param geohash The geohash of the location.
 * @returns The location encoded as GeoFire object.
 */
export declare function encodeGeoFireObject(location: number[], geohash: string): GeoFireObj;
/**
 * Decodes the location given as GeoFire object. Returns null if decoding fails.
 *
 * @param geoFireObj The location encoded as GeoFire object.
 * @returns The location as [latitude, longitude] pair or null if decoding fails.
 */
export declare function decodeGeoFireObject(geoFireObj: GeoFireObj): number[];
/**
 * Returns the key of a Firebase snapshot across SDK versions.
 *
 * @param A Firebase snapshot.
 * @returns The Firebase snapshot's key.
 */
export declare function geoFireGetKey(snapshot: firebase.database.DataSnapshot): string;
/**
 * Returns the id of a Firestore snapshot across SDK versions.
 *
 * @param A Firestore snapshot.
 * @returns The Firestore snapshot's id.
 */
export declare function geoFirestoreGetKey(snapshot: firebase.firestore.DocumentSnapshot): string;
/**
 * Method which calculates the distance, in kilometers, between two locations,
 * via the Haversine formula. Note that this is approximate due to the fact that the
 * Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param location1 The [latitude, longitude] pair of the first location.
 * @param location2 The [latitude, longitude] pair of the second location.
 * @returns The distance, in kilometers, between the inputted locations.
 */
export declare function distance(location1: number[], location2: number[]): number;
