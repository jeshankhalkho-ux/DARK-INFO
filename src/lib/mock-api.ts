import { delay } from "./utils";

// =============================================================================
// API CONFIGURATION
// =============================================================================
// Most upstream APIs (Number, Vehicle, PAN, Video) either don't send CORS
// headers or block non-browser User-Agents. We route them through this app's
// own backend at `/api/lookups/*`, which forwards each request server-side
// with a real browser User-Agent. This eliminates the dependency on flaky
// public CORS proxies.
const API_BASE = "/api/lookups";

// =============================================================================
// TYPES
// =============================================================================
export interface NumberLookupResult {
  name: string;
  fatherName: string;
  mobile: string;
  alternateMobile: string;
  aadhaar: string;
  state: string;
  circle: string;
  operator: string;
  address: string;
}

export interface VehicleLookupResult {
  ownership: {
    ownerName: string;
    fatherName: string;
    ownerSerialNo: string;
    registrationNumber: string;
    financierName: string;
    registeredRto: string;
  };
  vehicle: {
    modelName: string;
    makerModel: string;
    vehicleClass: string;
    fuelType: string;
    fuelNorms: string;
    chassisNumber: string;
    engineNumber: string;
  };
  insurance: {
    insuranceExpiry: string;
    insuranceNo: string;
    insuranceCompany: string;
  };
  dates: {
    registrationDate: string;
    vehicleAge: string;
    fitnessUpto: string;
    taxUpto: string;
    pucNo: string;
    pucUpto: string;
    insuranceUpto: string;
  };
  other: {
    financerName: string;
    cubicCapacity: string;
    seatingCapacity: string;
    permitType: string;
    blacklistStatus: string;
    nocDetails: string;
  };
  basicCard: {
    modalName: string;
    ownerName: string;
    code: string;
    cityName: string;
    phone: string;
    website: string;
    address: string;
  };
  registrationNumber: string;
}

export interface VideoLookupResult {
  thumbnail: string;
  platform: string;
  type: string;
  downloadUrl: string;
  videoUrl: string;
}

export interface ImageGenResult {
  images: string[];
  prompt: string;
}

export interface PanLookupResult {
  pan: string;
  gstNum: string;
  status: string;
  state: string;
}

export interface IfscLookupResult {
  ifsc: string;
  bank: string;
  branch: string;
  address: string;
  city: string;
  district: string;
  state: string;
  micr: string;
  contact: string;
  rtgs: boolean;
  neft: boolean;
  imps: boolean;
  upi: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================
const orDash = (v: unknown): string => {
  if (v === null || v === undefined) return "—";
  const s = String(v).trim();
  if (!s || s.toLowerCase() === "n/a" || s.toLowerCase() === "null") return "—";
  return s;
};

const pick = (obj: Record<string, unknown> | null | undefined, ...keys: string[]): string => {
  if (!obj) return "—";
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "—";
};

// =============================================================================
// REAL API CALLS
// =============================================================================
export const mockApi = {
  // ---------- NUMBER LOOKUP ----------
  // GET https://numberimfo.vishalboss.sbs/api.php?number=...&key=...
  // Response: { status, results: { "Result 1": {...}, ... } }
  lookupNumber: async (phone: string): Promise<NumberLookupResult> => {
    const res = await fetch(`${API_BASE}/number?phone=${encodeURIComponent(phone)}`);
    if (!res.ok) throw new Error(`Lookup failed (HTTP ${res.status})`);
    const json = await res.json();
    if (!json?.status) throw new Error(json?.message || "No data found for this number");
    const results = json.results || {};
    const firstKey = Object.keys(results)[0];
    const first = results["Result 1"] || (firstKey ? results[firstKey] : null);
    if (!first) throw new Error("No data found for this number");
    return {
      name: orDash(first.name),
      fatherName: orDash(first.father_name),
      mobile: orDash(first.mobile || phone),
      alternateMobile: orDash(first.alt_mobile),
      aadhaar: orDash(first.aadhar_number || first.aadhaar),
      state: orDash(first.state_circle || first.state),
      circle: orDash(first.state_circle || first.circle),
      operator: orDash(first.operator),
      address: orDash(first.address),
    };
  },

  // ---------- VEHICLE LOOKUP ----------
  // GET https://echat.ct.ws/vehicle.php?rcno=...
  // Response shape varies by upstream API; we map common Indian RC field names.
  lookupVehicle: async (rc: string): Promise<VehicleLookupResult> => {
    const res = await fetch(
      `${API_BASE}/vehicle?rc=${encodeURIComponent(rc.toUpperCase())}`,
    );
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.error || `Vehicle lookup failed (HTTP ${res.status})`);
    }
    const json = await res.json();
    // Upstream may wrap data as { results: { result1: {...} } } or flat.
    const data = json.data || json.result || json.response || json;
    const results = (data as Record<string, unknown>).results as
      | Record<string, Record<string, unknown>>
      | undefined;
    let v: Record<string, unknown>;
    if (results) {
      const first = (results.result1 || results["Result 1"] || Object.values(results)[0]) as
        | Record<string, unknown>
        | undefined;
      // Some upstreams nest sections like "Other Information", "Basic Card Info";
      // flatten one level so the pick() helper can find fields anywhere.
      v = {};
      if (first) {
        for (const [k, val] of Object.entries(first)) {
          if (val && typeof val === "object" && !Array.isArray(val)) {
            for (const [ik, iv] of Object.entries(val as Record<string, unknown>)) {
              v[ik] = iv;
              v[ik.toLowerCase().replace(/\s+/g, "_")] = iv;
            }
          } else {
            v[k] = val;
          }
        }
      }
    } else {
      v = data as Record<string, unknown>;
    }

    return {
      ownership: {
        ownerName: pick(v, "owner_name", "ownerName", "name"),
        fatherName: pick(v, "father_name", "fatherName", "father"),
        ownerSerialNo: pick(v, "owner_serial_no", "ownerSerialNo", "owner_count", "owner_no"),
        registrationNumber:
          pick(v, "rc_number", "registration_number", "reg_no", "registrationNumber") !== "—"
            ? pick(v, "rc_number", "registration_number", "reg_no", "registrationNumber")
            : rc.toUpperCase(),
        financierName: pick(v, "financier", "financer_name", "financier_name", "financerName"),
        registeredRto: pick(v, "rto", "rto_name", "registered_rto", "registeredRto", "office_name"),
      },
      vehicle: {
        modelName: pick(v, "model", "model_name", "modelName"),
        makerModel: pick(v, "maker_model", "makerModel", "vehicle_make_model", "manufacturer"),
        vehicleClass: pick(v, "vehicle_class", "vehicleClass", "class"),
        fuelType: pick(v, "fuel_type", "fuelType", "fuel"),
        fuelNorms: pick(v, "fuel_norms", "fuelNorms", "norms", "emission_norms"),
        chassisNumber: pick(v, "chassis_no", "chassis_number", "chassisNumber", "chassis"),
        engineNumber: pick(v, "engine_no", "engine_number", "engineNumber", "engine"),
      },
      insurance: {
        insuranceExpiry: pick(
          v,
          "insurance_upto",
          "insurance_expiry",
          "insurance_validity",
          "insuranceExpiry",
        ),
        insuranceNo: pick(
          v,
          "insurance_no",
          "insurance_policy_no",
          "insurance_policy",
          "insuranceNo",
        ),
        insuranceCompany: pick(
          v,
          "insurance_company",
          "insurance_provider",
          "insuranceCompany",
        ),
      },
      dates: {
        registrationDate: pick(v, "registration_date", "reg_date", "registrationDate"),
        vehicleAge: pick(v, "vehicle_age", "age", "vehicleAge"),
        fitnessUpto: pick(v, "fitness_upto", "fitness_validity", "fitnessUpto"),
        taxUpto: pick(v, "tax_upto", "tax_validity", "taxUpto"),
        pucNo: pick(v, "puc_no", "puc_number", "pucNo"),
        pucUpto: pick(v, "puc_upto", "puc_validity", "pucUpto"),
        insuranceUpto: pick(v, "insurance_upto", "insurance_validity", "insuranceUpto"),
      },
      other: {
        financerName: pick(v, "financier", "financer_name", "financerName"),
        cubicCapacity: pick(v, "cubic_capacity", "cc", "cubicCapacity", "engine_capacity"),
        seatingCapacity: pick(
          v,
          "seating_capacity",
          "seat_capacity",
          "seatingCapacity",
          "seats",
        ),
        permitType: pick(v, "permit_type", "permitType", "permit"),
        blacklistStatus:
          pick(v, "blacklist_status", "black_list_status", "blacklistStatus") !== "—"
            ? pick(v, "blacklist_status", "black_list_status", "blacklistStatus")
            : "Not Blacklisted",
        nocDetails:
          pick(v, "noc_details", "noc", "nocDetails") !== "—"
            ? pick(v, "noc_details", "noc", "nocDetails")
            : "No NOC",
      },
      basicCard: {
        modalName: pick(v, "model", "model_name", "modal_name"),
        ownerName: pick(v, "owner_name", "ownerName"),
        code:
          pick(v, "rto_code", "code") !== "—"
            ? pick(v, "rto_code", "code")
            : rc.toUpperCase().substring(0, 4),
        cityName: pick(v, "city", "city_name", "rto_city"),
        phone: pick(v, "rto_phone", "phone", "contact"),
        website: "https://parivahan.gov.in",
        address: pick(v, "address", "rto_address"),
      },
      registrationNumber:
        pick(v, "rc_number", "registration_number", "reg_no") !== "—"
          ? pick(v, "rc_number", "registration_number", "reg_no")
          : rc.toUpperCase(),
    };
  },

  // ---------- VIDEO DOWNLOADER ----------
  // GET https://tele-social.vercel.app/down?url=...
  // Response: { platform, status, data: { type, thumbnail, media: { video, download } } }
  // Routed through CORS proxy because the upstream doesn't send CORS headers.
  lookupVideo: async (url: string): Promise<VideoLookupResult> => {
    const res = await fetch(`${API_BASE}/video?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Lookup failed (HTTP ${res.status})`);
    const json = await res.json();
    if (!json?.status) {
      throw new Error(json?.Message || json?.message || "Could not extract video");
    }
    const data = json.data || {};
    const media = data.media || {};
    const downloadUrl = media.download || media.video || data.video || "";
    const videoUrl = media.video || media.download || data.video || "";
    if (!downloadUrl && !videoUrl) throw new Error("No downloadable media in response");
    return {
      thumbnail: data.thumbnail || data.thumb || "",
      platform: json.platform || "Video",
      type: data.type || "video",
      downloadUrl,
      videoUrl,
    };
  },

  // ---------- IMAGE GENERATION ----------
  // GET https://anshapiimgegn.vercel.app/api?imgp=... (returns PNG binary)
  // We just hand back the URL — <img src> loads it directly (no CORS needed).
  generateImage: async (
    prompt: string,
    style?: string,
    _aspect?: string,
  ): Promise<ImageGenResult> => {
    await delay(150);
    const promptWithStyle = style && style !== "none" ? `${prompt}, ${style}` : prompt;
    const url = `https://anshapiimgegn.vercel.app/api?imgp=${encodeURIComponent(
      promptWithStyle,
    )}&t=${Date.now()}`;
    return { images: [url], prompt: promptWithStyle };
  },

  // ---------- PAN -> GST ----------
  // GET https://razorpay.com/api/gstin/pan/{PAN}
  // Response: { count, items: [{ gstin, auth_status, state }], pan }
  // Routed through CORS proxy — razorpay.com doesn't send CORS headers.
  lookupPan: async (pan: string): Promise<PanLookupResult> => {
    const PAN = pan.toUpperCase();
    const res = await fetch(`${API_BASE}/pan/${encodeURIComponent(PAN)}`);
    if (!res.ok) throw new Error(`Lookup failed (HTTP ${res.status})`);
    const json = await res.json();
    if (!json?.items?.length) {
      throw new Error("No GST registration found for this PAN");
    }
    const first = json.items[0];
    return {
      pan: json.pan || PAN,
      gstNum: first.gstin || "—",
      status: first.auth_status || "Unknown",
      state: first.state || "—",
    };
  },

  // ---------- IFSC LOOKUP ----------
  // GET https://ifsc.razorpay.com/{IFSC}
  // This endpoint sends `Access-Control-Allow-Origin: *`, so we hit it directly.
  lookupIfsc: async (ifsc: string): Promise<IfscLookupResult> => {
    const code = ifsc.toUpperCase();
    const res = await fetch(`https://ifsc.razorpay.com/${encodeURIComponent(code)}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("IFSC code not found");
      throw new Error(`Lookup failed (HTTP ${res.status})`);
    }
    const json = await res.json();
    return {
      ifsc: json.IFSC || code,
      bank: json.BANK || "—",
      branch: json.BRANCH || "—",
      address: json.ADDRESS || "—",
      city: json.CITY || "—",
      district: json.DISTRICT || "—",
      state: json.STATE || "—",
      micr: json.MICR || "—",
      contact: json.CONTACT || "—",
      rtgs: !!json.RTGS,
      neft: !!json.NEFT,
      imps: !!json.IMPS,
      upi: !!json.UPI,
    };
  },
};
