import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react'; // Import the necessary React hooks
import { contractABI, contractAddress } from "./contracts/Edu.tsx";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import { formatUnits } from "ethers";

import { BigNumberish } from "ethers";


const divStyle = {
  display: 'flex',
  padding: '5px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
};

const pStyle = {
  margin: '5px',
  // Fix the type of textAlign
  padding: '2px',
  border: '2px solid #ccc',
  borderRadius: '4px',
};

export default function App() {
  const { address } = useAccount();

  // Ensure null checks for data retrieval
  const { data: name } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "name",
  }) || {};

  const { data: symbol } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "symbol",
  }) || {};

  const { data: balance } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "balanceOf",
    args: [address || "0x"], // Use address or a default value
    watch: true,
  }) || {};

  return (
    <div>
      <ConnectButton />

      <div style={divStyle}>
        <p style={{...pStyle, textAlign: 'center'}}>
          Name <br /> {name as string || '---'} {/* Provide a default value if name is not available */}
        </p>
        <p style={pStyle}>
          Symbol <br />
          {symbol as string || '---'} {/* Provide a default value if symbol is not available */}
        </p>
        <p style={pStyle}>
          Your balance <br />
          {balance ? formatUnits(balance as BigNumberish, 0) : 'NIL'} {/* Provide a default value if balance is not available */}
        </p>
      </div>
    </div>
  );
}
        