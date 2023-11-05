import React, { useState, ChangeEvent } from 'react';
import { Web3Storage } from 'web3.storage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from 'wagmi';
import { formatUnits } from 'ethers';
import { BigNumberish } from 'ethers';

import { contractABI, contractAddress } from './contracts/Edu.tsx';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU2M0Y1QmY4Qzc1ODUyMDNjYjI1N2U1ZGMzNTc0Q0RFZjNkQTQ3MjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTkxOTkwNDk4NDksIm5hbWUiOiJCbG9ja1Byb2plY3QifQ.9YeSfVvKRdOkToaoWo0ZYcbxSuXrhJ_fIiFL9WrzwzI'; // Replace with your actual API token

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px',
};

const uploadButtonStyle: React.CSSProperties = {
  background: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '20px',
};

const outputStyle: React.CSSProperties = {
  marginTop: '20px',
};

const divStyle: React.CSSProperties = {
  display: 'flex',
  padding: '5px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
};

const pStyle: React.CSSProperties = {
  margin: '5px',
  padding: '2px',
  border: '2px solid #ccc',
  borderRadius: '4px',
};

export default function App(): JSX.Element {
  const { address } = useAccount();

  // Ensure null checks for data retrieval
  const { data: name } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'name',
  }) || {};

  const { data: symbol } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'symbol',
  }) || {};

  const { data: balance } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address || '0x'], // Use address or a default value
    watch: true,
  }) || {};

  // Web3.Storage

  const [fileInput, setFileInput] = useState<File | null>(null);
  const [output, setOutput] = useState<string>('');

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileInput(selectedFile);
  };

  const handleUpload = async () => {
    if (!fileInput) {
      setOutput('Please select a file before uploading.');
      return;
    }

    try {
      const client = new Web3Storage({ token: API_TOKEN });

      // Pack files into a CAR and send to web3.storage
      const rootCid = await client.put([fileInput]);

      // Get info on the Filecoin deals that the CID is stored in
      const info = await client.status(rootCid);

      // Fetch and verify files from web3.storage
      const res = await client.get(rootCid);
      const files = await res.files();

      for (const file of files) {
        console.log(`${file.cid} ${file.name} ${file.size}`);
      }

      // Display information
      setOutput(`File Uploaded. CID: ${rootCid}\nStatus: ${info ? info.status : 'Unknown'}`);
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error occurred. Please try again.');
    }
  };

  return (
    <div>
      <ConnectButton />
      <h1 style={{ textAlign: 'center' }}>Edu Token</h1>
      <div style={divStyle}>
        <p style={{ ...pStyle, textAlign: 'center' }}>
          Name <br /> {name as string || '---'}
        </p>
        <p style={pStyle}>
          Symbol <br />
          {symbol as string || '---'}
        </p>
        <p style={pStyle}>
          Your balance <br />
          {balance ? formatUnits(balance as BigNumberish, 0) : 'NIL'}
        </p>
      </div>
      <div style={containerStyle}>
        <h1>Web3.Storage File Upload</h1>
        <input type="file" onChange={handleFileInputChange} />
        <br />
        <button onClick={handleUpload} style={uploadButtonStyle}>
          Upload File
        </button>
        <div style={outputStyle}>{output}</div>
      </div>
    </div>
  );
}
