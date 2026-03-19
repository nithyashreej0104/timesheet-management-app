// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   // apiUrl: 'http://localhost:2025/api' 
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.



const localIP = 'http://10.85.99.27:2025';  // Your Laptop Wi-Fi IP
const prodIP = 'https://api.your-live-server.com'; // Your Real Server

// 2. The Master Switch
const useProduction = false; // <--- CHANGE THIS to true for Production

export const environment = {
  production: useProduction,
  apiUrl: useProduction ? prodIP : localIP
};

// 192.168.1.47

// 192.168.1.32