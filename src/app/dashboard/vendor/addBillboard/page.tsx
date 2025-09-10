"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Sidebar from "../Sidebar";
// Google Maps types are available globally after loading the Maps JS API
// No need to import types; use window.google.maps.* directly

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function AddBillboard() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    city: "",
    address: "",
    pincode: "",
    length: "",
    width: "",
    price: "",
    status: "active",
    available: "yes",
    longitude: "",
    latitude: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const cityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  // Places Autocomplete instance
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };


  // Google Maps Places Autocomplete widget for address
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps &&
      addressInputRef.current &&
      !autocompleteRef.current
    ) {
  const googleMaps = window.google.maps;
  autocompleteRef.current = new googleMaps.places.Autocomplete(addressInputRef.current!, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current!.getPlace();
        if (place && place.formatted_address) {
          // Extract city and pincode from address components
          let city = "";
          let pincode = "";
          if (place.address_components) {
            for (const comp of place.address_components) {
              if (comp.types.includes("locality")) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_2") && !city) {
                city = comp.long_name;
              }
              if (comp.types.includes("postal_code")) {
                pincode = comp.long_name;
              }
            }
          }
          setForm((prev) => ({
            ...prev,
            address: place.formatted_address ?? prev.address,
            city: city || prev.city,
            pincode: pincode || prev.pincode,
            latitude: place.geometry?.location?.lat() ? place.geometry.location.lat().toString() : prev.latitude,
            longitude: place.geometry?.location?.lng() ? place.geometry.location.lng().toString() : prev.longitude,
          }));
          // Center map to selected place
          if (map && place.geometry?.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
            if (markerRef.current) markerRef.current.setMap(null);
            const newMarker = new googleMaps.Marker({
              position: place.geometry.location,
              map,
              draggable: true,
            });
            markerRef.current = newMarker;
            newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
              if (!e.latLng) return;
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              // Reverse geocode to get address, city, pincode
              const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
              );
              const data = await res.json();
              if (data.status === "OK" && data.results.length > 0) {
                let city = "";
                let pincode = "";
                if (data.results[0].address_components) {
                  for (const comp of data.results[0].address_components) {
                    if (comp.types.includes("locality")) {
                      city = comp.long_name;
                    }
                    if (comp.types.includes("administrative_area_level_2") && !city) {
                      city = comp.long_name;
                    }
                    if (comp.types.includes("postal_code")) {
                      pincode = comp.long_name;
                    }
                  }
                }
                setForm((prev) => ({
                  ...prev,
                  address: data.results[0].formatted_address ?? prev.address,
                  city: city || prev.city,
                  pincode: pincode || prev.pincode,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                }));
              }
            });
          }
        }
      });
    }
  }, [map]);

  // Load Google Map after script loads
  // Robust map initialization: run when script loads, ref is ready, or form changes
  useEffect(() => {
    if (
      mapRef.current &&
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps &&
      !map
    ) {
      const center = {
        lat: form.latitude ? Number(form.latitude) : 28.6139,
        lng: form.longitude ? Number(form.longitude) : 77.209,
      };
  const googleMaps = window.google.maps;
  const m = new googleMaps.Map(mapRef.current!, {
        center,
        zoom: 13,
      });
      setMap(m);
    }
  }, [mapLoaded, mapRef, form.latitude, form.longitude, map]);

  // Update marker when coordinates change
  useEffect(() => {
    if (
      map &&
      form.latitude &&
      form.longitude &&
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps
    ) {
      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      const googleMaps = window.google.maps;
      const newMarker = new googleMaps.Marker({
        position: { lat: Number(form.latitude), lng: Number(form.longitude) },
        map,
        draggable: true,
      });
      markerRef.current = newMarker;
      // Update coordinates when marker is dragged
      newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
        // Reverse geocode to get address
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          setForm((prev) => ({ ...prev, address: data.results[0].formatted_address ?? prev.address }));
        }
      });
    }
  }, [map, form.latitude, form.longitude]);

  // Allow user to click on map to set marker
  useEffect(() => {
    if (
      map &&
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps
    ) {
  const googleMaps = window.google.maps;
      googleMaps.event.clearListeners(map, "click");
      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
        // Reverse geocode to get address
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          setForm((prev) => ({ ...prev, address: data.results[0].formatted_address ?? prev.address }));
        }
      });
    }
  }, [map]);

  const handleAddressSearch = async () => {
    setSearching(true);
    setError("");
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(form.address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setForm({ ...form, longitude: location.lng, latitude: location.lat });
        // Center and zoom the map to the found location
        if (map && typeof window !== "undefined" && window.google && window.google.maps) {
          const googleMaps = window.google.maps;
          map.setCenter({ lat: location.lat, lng: location.lng });
          map.setZoom(16);
          // Place marker
          if (markerRef.current) markerRef.current.setMap(null);
          const newMarker = new googleMaps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            draggable: true,
          });
          markerRef.current = newMarker;
          newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
            // Reverse geocode to get address
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.status === "OK" && data.results.length > 0) {
              setForm((prev) => ({ ...prev, address: data.results[0].formatted_address ?? prev.address }));
            }
          });
        }
      } else {
        setError("Address not found. Please enter a valid address.");
      }
    } catch {
      setError("Error fetching location. Try again.");
    }
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
      const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('city', form.city);
      formData.append('address', form.address);
      formData.append('pincode', form.pincode);
      formData.append('dimensionLen', form.length);
      formData.append('dimensionWid', form.width);
      formData.append('price', form.price);
      formData.append('status', form.status);
      formData.append('available', form.available === "yes" ? "true" : "false");
      formData.append('longitude', form.longitude);
      formData.append('latitude', form.latitude);
      
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }
      
      const res = await fetch(apiUrl("/users/vendor/billboard/add/"), {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          // Don't set Content-Type header for FormData, let browser set it with boundary
        },
        body: formData
      });
      if (res.ok) {
        alert("Billboard added successfully!");
        setForm({
          title: "",
          type: "",
          city: "",
          address: "",
          pincode: "",
          length: "",
          width: "",
          price: "",
          status: "active",
          available: "yes",
          longitude: "",
          latitude: ""
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setError("Failed to add billboard.");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl h-[700px]">
          {/* Form Section */}
          <div className="flex flex-col justify-center h-full bg-white rounded-2xl shadow-lg p-10">
            <div className="mb-2">
              <Link href="/dashboard/vendor" className="text-green-700 hover:underline font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Add Billboard</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Field */}
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
                placeholder="Billboard Title" 
                className="w-full p-3 border border-gray-300 rounded-lg text-black" 
              />
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Billboard Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload an image
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <input name="type" value={form.type} onChange={handleChange} required placeholder="Type" className="w-full p-3 border border-gray-300 rounded-lg text-black" />
              {/* City field auto-filled from address, read-only */}
              <input
                name="city"
                value={form.city}
                required
                placeholder="City (auto-filled)"
                className="w-full p-3 border border-gray-300 rounded-lg text-black bg-gray-100 cursor-not-allowed"
                autoComplete="off"
                ref={cityInputRef}
                readOnly
              />
              {/* Address input with Google Maps Places Autocomplete */}
              <div className="flex gap-2 relative">
                <div className="flex-1 relative">
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Landmark Address (Type to search)"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black"
                    autoComplete="off"
                    ref={addressInputRef}
                  />
                </div>
                <button type="button" onClick={handleAddressSearch} disabled={searching} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                  {searching ? "Searching..." : "Get Location"}
                </button>
              </div>
              {form.longitude && form.latitude && (
                <div className="text-green-700 text-sm">Coordinates: {form.latitude}, {form.longitude}</div>
              )}
              <input name="pincode" value={form.pincode} required placeholder="Pincode (auto-filled)" className="w-full p-3 border border-gray-300 rounded-lg text-black bg-gray-100 cursor-not-allowed" readOnly />
              <div className="flex gap-4">
                <input name="length" value={form.length} onChange={handleChange} required placeholder="Length (ft)" className="flex-1 p-3 border border-gray-300 rounded-lg text-black" />
                <input name="width" value={form.width} onChange={handleChange} required placeholder="Width (ft)" className="flex-1 p-3 border border-gray-300 rounded-lg text-black" />
              </div>
              <input name="price" value={form.price} onChange={handleChange} required placeholder="Price per day" className="w-full p-3 border border-gray-300 rounded-lg text-black" />
              <div className="flex gap-4">
                <select name="status" value={form.status} onChange={handleChange} className="flex-1 p-3 border border-gray-300 rounded-lg text-black">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select name="available" value={form.available} onChange={handleChange} className="flex-1 p-3 border border-gray-300 rounded-lg text-black">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {error && (
                <div className="w-full flex justify-center">
                  <span className="text-red-500 text-sm text-center mb-3 px-2 max-w-[90%]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {error}
                  </span>
                </div>
              )}
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Add Billboard</button>
            </form>
          </div>
          {/* Google Map Section */}
          <div className="flex flex-col justify-center h-full">
            <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-2xl shadow-lg" style={{ minHeight: "600px", borderRadius: "1rem", boxShadow: "0 2px 16px #0001" }} />
            {/* Load Google Maps JS API with Places library */}
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
              strategy="afterInteractive"
              onLoad={() => setMapLoaded(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
