import { GiftifyABI } from "../utils/abi/Giftify";
import { USDE } from "../utils/abi/USDE";
import { sUSDe } from "../utils/abi/sUSDe";

export const contracts = {
    GIFTIFY: {
        contract: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5",
        abi: GiftifyABI
    },
    USDE: {
        contract: "0x7D6AF0F5F5A00685dB264ee5506eDEbf1CcaeBac",
        abi: USDE
    },
    SUSDE: {
        contract: "0x946761086BE06a5Ba55295411b69D5ef1AAbf808",
        abi: sUSDe
    }
}