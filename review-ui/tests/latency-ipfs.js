const JWT = process.env.REACT_APP_PINATA_API_KEY;
const fs = require("fs");
const axios = require("axios");

const FormData = require('form-data');


async function pinFileToIPFS() {
  try {
    
    const uploadToIPFSTime = [];
    const downloadFromIPFSTime = [];
    for (i=0; i<50; i++) {
      let uploadToIPFSStartTime = Date.now().toString();
      const formData = new FormData();
      const src = "./tests/pinata_file_upload_test.pdf";
  
      const file = fs.createReadStream(src);
      formData.append("file", file);
  
      const pinataMetadata = JSON.stringify({
        name: "pinata_latency_test.pdf",
      });
      formData.append("pinataMetadata", pinataMetadata);
  
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", pinataOptions);
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData,
                      {
                      headers: {
                          "Authorization": `Bearer ${JWT}`,
                      }
                  });
      let uploadToIPFSEndTime = Date.now().toString();

      let uploadToIPFSTotalTIme = (uploadToIPFSEndTime - uploadToIPFSStartTime).toString();
      uploadToIPFSTime.push(uploadToIPFSTotalTIme);
    }

    for (i=0; i<50; i++) {
      let downloadFromIPFSStartTime = Date.now().toString();
      const url = "https://blush-hollow-canidae-322.mypinata.cloud/ipfs/QmVKXHi1rv3NE6iwMG1AN2gpSbbSDHn7k1J2ZZdyLQncXy?pinataGatewayToken=SDNcCgXbElxydQ0PRp7WMxVpGMOH5ejhMEfNUksgU5YLozwprqrVdkCRWWSf5j5A";
      const res = await axios.get(url);
      let downloadFromIPFSEndTime = Date.now().toString();
      downloadFromIPFSTotalTime = (downloadFromIPFSEndTime - downloadFromIPFSStartTime).toString();
      downloadFromIPFSTime.push(downloadFromIPFSTotalTime);
    }

    console.log('uploadToIPFSTime', uploadToIPFSTime);
    console.log('downloadFromIPFSTime', downloadFromIPFSTime);

  } catch (error) {
    console.log(error);
  }
}


pinFileToIPFS();