const fs = require('fs');

const eventRoles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];
const champions = ['1097200827485130792', '1097200822196109534', '1097200811295121418', '1097200228156846090', '971450716222795907']
const successColor = 0xa1f60d
const failColor = 0xee1053
const midColor = 0xe8d144
const mainColor = 0x9caef2

function readJSON(filePath) {
    let RolesList;
    console.log(RolesList)
    try {
        // Reading 
        const data = fs.readFileSync(filePath, 'utf8');
        RolesList = JSON.parse(data);
    } catch (err) {
        // Catching error
        console.log(`Error reading ${filePath}:`, err);
    }
    console.log(RolesList)
    return RolesList; // Return
}

function writeJSON(dataToWrite, filePath) {
    try {
        const jsonData = JSON.stringify(dataToWrite, null, 2);
        fs.writeFileSync(filePath, jsonData);
      } catch (err) {
        // If there was an error writing data to json file
        console.log(`Error writing to ${filePath}:`, err);
      }
}

module.exports = { eventRoles, champions, successColor, failColor, midColor, successColor, mainColor, readJSON, writeJSON };