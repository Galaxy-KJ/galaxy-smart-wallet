"use client";

import React, { useState } from "react";
import { verifyMessage as verifyEthMessage } from "ethers";
import * as bitcoinMessage from "bitcoinjs-message";
import { Keypair } from "@stellar/stellar-sdk";
import { FaKey, FaCheck, FaRedo, FaShieldAlt, FaCloud } from "react-icons/fa"; // Importing icons

type BlockchainType = "ethereum" | "bitcoin" | "stellar";

const initialState = {
  message: "",
  address: "",
  signature: "",
  blockchain: "ethereum" as BlockchainType,
};

const VerifySignatureTab: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setResult(null);
  };

  const resetForm = () => {
    setForm(initialState);
    setResult(null);
    setError(null);
  };

  const verifySignature = async () => {
    const { message, address, signature, blockchain } = form;

    if (!message || !address || !signature) {
      setError("All fields are required.");
      return;
    }

    try {
      if (blockchain === "ethereum") {
        const recoveredAddress = verifyEthMessage(message, signature);
        setResult(recoveredAddress.toLowerCase() === address.toLowerCase());
      } else if (blockchain === "bitcoin") {
        const isValid = bitcoinMessage.verify(message, address, signature);
        setResult(isValid);
      } else if (blockchain === "stellar") {
        const keypair = Keypair.fromPublicKey(address);
        const isValid = keypair.verify(
          Buffer.from(message),
          Buffer.from(signature, "base64")
        );
        setResult(isValid);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Verification failed: " + err.message);
      } else {
        setError("Verification failed: Unknown error");
      }
      setResult(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center mt-6">
        <h2 className="text-purple-800 font-bold text-xl">
          Signature and Verification Tools
        </h2>
        <p className="text-gray-300 text-xs mb-2">
          Secure tools for cryptographic operations, message signing, and
          verification.
        </p>
      </div>
      <div className="bg-gray-900/50 p-2 rounded-lg shadow-lg border border-gray-800 backdrop-blur-md text-gray-200 max-w-3xl mx-auto w-full mb-4 flex flex-wrap gap-4 justify-between">
        <div className="flex items-center px-2 py-2 ">
          <FaShieldAlt className="mr-2" size={12} />
          <p>Sign Message</p>
        </div>

        {/* Item 2 */}
        <div className="flex items-center bg-purple-800 text-white px-2 py-2 rounded-md">
          <FaCheck className="mr-2" size={12} />
          <p>Verify Signature</p>
        </div>

        {/* Item 3 */}
        <div className="flex items-center px-2 py-2 ">
          <FaKey className="mr-2" size={12} />
          <p>Proof of Ownership</p>
        </div>

        {/* Item 4 */}
        <div className="flex items-center  px-2 py-2">
          <FaCloud className="mr-2" size={12} />
          <p>Hash Generator</p>
        </div>
      </div>

      <div className="bg-gray-900/50 p-6 rounded-lg shadow-lg border border-gray-800 backdrop-blur-md text-gray-200 max-w-3xl mx-auto w-full">
        <h2 className="text-xl font-semibold mb-4">Verify Signature</h2>
        <p className="text-xs mb-4 text-purple-300">
          Verify that a message was signed by the owner of a specific public key
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-purple-400 mb-2">message</p>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder=" Enter the original message"
              className="w-full p-2 bg-gray-800/30 border border-gray-800 rounded-lg resize-none"
              rows={4}
            />
          </div>
          <div>
            <p className="text-purple-400 mb-2">public key or address </p>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Public Key or Address"
              className="w-full p-2 bg-gray-800/30 border border-gray-800 rounded-lg"
            />
          </div>

          <div>
            <p className="text-purple-400 mb-2">signature</p>
            <textarea
              name="signature"
              value={form.signature}
              onChange={handleChange}
              placeholder="Enter the signature to verify"
              className="w-full p-3 bg-gray-800/30 border border-gray-800 rounded-lg resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-between mt-4 gap-4">
            <button
              onClick={verifySignature}
              className="bg-purple-600 text-white p-3 rounded-lg transition-colors hover:bg-purple-700 flex-1 flex items-center justify-center"
            >
              <FaCheck className="mr-2" size={10} /> Verify Signature
            </button>
            <button
              onClick={resetForm}
              className=" text-white p-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaRedo className="mr-2" size={10} />
              Reset
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}

          {result !== null && (
            <p
              className={`mt-4 font-semibold ${
                result ? "text-green-400" : "text-red-400"
              }`}
            >
              Signature is {result ? "Valid ✅" : "Invalid ❌"}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="mt-6 text-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center bg-gray-800/30 p-2 rounded-md">
            <div className="flex items-center">
              <FaShieldAlt className="mr-2" size={10} color="#6B21A8" />{" "}
              <h3 className="font-bold">Security First:</h3>
            </div>

            <div className="flex items-center">
              <p className="text-center text-xs text-gray-500">
                All cryptographic operations are <br />
                performed locally in your browser. <br />
                Your private keys never leave your device.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-800/30 p-2 rounded-md">
            <div className="flex items-center">
              <FaCloud className="mr-1" size={10} color="#6B21A8" />{" "}
              <h3 className="font-bold">Blockchain Compatible:</h3>
            </div>
            <div className=" items-center">
              <p className="text-center text-xs text-gray-500">
                Our tools are compatible with major <br /> blockchain standards
                including <br /> Ethereum, Bitcoin, and Stellar.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-800/30 p-2 rounded-md">
            <div className="flex items-center">
              <FaCheck className="mr-1" size={10} color="#6B21A8" />
              <h3 className="font-bold">Verify Anything:</h3>
            </div>
            <div className="flex items-center">
              <p className="text-center text-xs text-gray-500">
                From simple messages to complex <br /> transactions, verify
                signatures and <br /> prove ownership of blockchain assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySignatureTab;
