import React from 'react';
import { Wallet } from './Wallet';

const Logo: React.FC = () => (
    <img 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARRSURBVHhe7ZxLy8xAFIf9b8EiiCSKdhUsChYVewt2L+xV3A/wo/APFNtbsLFeREQRKxZsbEWs2FiINFBEhERkX/7/yZ0EmaS7mTcm+fDA5aSb+yZ5k3OTPDz++eH/gP/99tBE9+iPj4w/YgC+qV++iP4h+k1X9Lp+32C3i3//P//n3v8D2+hKk/QeDYA3/v9wHl2rTqA70U//5t+G/Wl1/wOAYcTf/+c/APf7Lp+g71F9/4/0XwDX6f+D9AKwP/2H4D4N0/cH6APg/n+v//8P7N/27gH4g/T5B0D6w/36829Abw/YvwC+b8v3Q/p+h/Y7AP0f0g8Ax/4C9J/p+9v+DwD/kP5h+j6E/j/QewG4/p7+D/p+Cfp7AP37n74B3P+L/v8/s3/bDwD6d+2+f8D+P/1//w34/p3+A3Cv6f0f0n8A1uv/B/sP0P/Z6foF6f4P9B8B5/sv9L9E//1vQN8D+w/Qfwj+A/A/hP/A7h+g/69G9K3p+gN0/uH+E9AfBf07hP9E/13QdwT0H6D/EPwD8E9E/7eC3glwv/T7D/B7wL9D+t0T9K8G/QfwW9H3L+i3gP9T0e9E3wH8VoR/gP9z038B/D7QfwJ+C/L/S/qdgP9zo78F+H1A/wPw/0n6T4C/T9L/Bvj9OP0fwL8f+h+gv0/QvwH8/gz9/gH8+9P/H9CPgP8P6M/A/j9H/wn48+P/Q/jzI/8J+L979L8Bf38C//9h/B/A/0/0nwD//gn9D8D/h/T/AN78BP4H8O8x/P//+M8Q/v//8+cg/O+/+M9F+M9/979A/Odf/OcvwX/+RfgvYvgvwvgvYvjPYviPYvg/xPCfRvg/xPCvQvg/wPC/wPAnIfxJCP8Swn+Vwn8Vw18Vw3+N4T+N4D+D4D+D4D9D4D+D/6//Sj998/1H8z8A+s/A+j+4fo30P2k/8P0P0s/Vf+H6b9J/oP2H/L/T/Qfs/4n037T/QPv/Vvqf0P+Q/T/QfsL+w/of0H9J/0P9Z+L/f6r/TP9/qv/K/h/T/4H03/j/36z/jvt/rP8M/R/SvzP9V/Z/Tv9H8v/fUP/J/P9D/SP7/0T/D8T/L/l/Av3/qf+D+D9a/T/Afy75PwL9n6r/E+L/aPUn4H+u+D8D/R+r/wnxf6z6E/C/N/yfkf/D6k/A/0Hy/wn5/1n+E/J/rPwn+L9L/hPz/wH//3t84hN8c/3/j/f+X/j5x/A/4f/H4z9H/I/8P/8P+v/71j/h+s/+v/41z/g+d//X/+aZ/ybO//rX/Osf8az/w3Nf87zPxPa/4nNf8fzP6m/30T3n8V+L8//pf8+v6n5X/V/p/d/7X5P1v/1/z/7X+p/d/3f/X7P/v/FwL8Pfv/e+D//y/9VwT8O/X/T+//w/91gP8e/T8M/8D9//F+H8D/R+L/4vwf5f+z/M/A/z7w/0X5P8v//4X/u+T//4/53wv+H6r/8f5f8H9+vP+L/7+3///L/A9m/A9o/g9l+T8H7X/H+r/0/7d23wftf0/t//P/n1r/r9H+f/T/r9H/f/f/r//7N//71/+1m/bLAAAAAAAAAAAAAAAAAAAAAAAAAAAAwL/t39E/i/03y0l/m/bLgAAAABJRU5ErkJggg==" 
        alt="Somnia Logo" 
        className="w-10 h-10 rounded-full" 
    />
);


export const Header: React.FC<{
  account: string;
  isConnected: boolean;
  isConnecting: boolean;
  networkName: string;
  onConnectWallet: () => void;
}> = ({ account, isConnected, isConnecting, networkName, onConnectWallet }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Logo />
        <div>
          <h1 className="text-2xl font-bold text-white">Somnia NFT Auction</h1>
          <p className="text-sm text-gray-300">Hackathon Demo - Real-Time Web3 Auction Platform</p>
          <p className="text-xs text-gray-400 mt-1">
              <span className="font-semibold">Network:</span> Somnia Testnet (Shannon) - <span className="font-semibold">Chain ID:</span> 50312
          </p>
        </div>
      </div>
      <Wallet 
        account={account}
        isConnected={isConnected}
        isConnecting={isConnecting}
        networkName={networkName}
        onConnect={onConnectWallet}
      />
    </header>
  );
};