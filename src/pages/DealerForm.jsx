import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapPicker from '../components/MapPicker';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import Swal from 'sweetalert2';

export default function DealerForm(){
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({ defaultValues: { enquiryType: 'dealer', dealerLocation: { latitude: '', longitude: '', address: '' } } });
  const [searchParams] = useSearchParams();
  const enquiryType = watch('enquiryType');
  const isBulk = enquiryType === 'bulk';
  const [submitting, setSubmitting] = React.useState(false);
  const [locating, setLocating] = React.useState(false);
  const [locationError, setLocationError] = React.useState('');
  const [hasDealerCoords, setHasDealerCoords] = React.useState(false);
  const [showMapPicker, setShowMapPicker] = React.useState(false);

  // Prefill from URL: ?enquiryType=bulk&prefill=...
  React.useEffect(() => {
    const typeParam = searchParams.get('enquiryType') || searchParams.get('type');
    const prefillMsg = searchParams.get('prefill') || searchParams.get('message') || '';
    if (typeParam === 'bulk') setValue('enquiryType', 'bulk');
    if (prefillMsg) setValue('message', prefillMsg);
  }, [searchParams, setValue]);

  // Keep derived "has coords" flag in sync with RHF state for dealer enquiries
  React.useEffect(() => {
    if (isBulk) {
      setHasDealerCoords(false);
      setLocationError('');
      return;
    }
    const lat = watch('dealerLocation.latitude');
    const lng = watch('dealerLocation.longitude');
    const ok = lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
    setHasDealerCoords(!!ok);
  }, [isBulk, watch]);

  // Reverse geocode coordinates to address using Nominatim
  async function reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!response.ok) throw new Error('Reverse geocoding failed');
      const data = await response.json();
      const address = data.address || {};
      return {
        formattedAddress: data.display_name || '',
        state: address.state || '',
        district: address.county || address.city || address.town || address.village || '',
        area: address.suburb || address.neighbourhood || address.hamlet || '',
        pincode: address.postcode || '',
        address: [
          address.house_number,
          address.road || address.street,
          address.postcode
        ].filter(Boolean).join(', ') || data.display_name || '',
        landmark: address.building || address.shop || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Fallback: extract 6-digit PIN code from a free-form address string
  function extractPincode(text) {
    if (!text || typeof text !== 'string') return '';
    const m = text.match(/\b(\d{6})\b/);
    return m ? m[1] : '';
  }

  // Handle location selected from map
  function handleMapLocationSelect(locationData) {
    setValue('dealerLocation.latitude', locationData.latitude.toString(), { shouldValidate: true });
    setValue('dealerLocation.longitude', locationData.longitude.toString(), { shouldValidate: true });
    setValue('dealerLocation.address', locationData.formattedAddress);
    setValue('state', locationData.state);
    setValue('district', locationData.district);
    setValue('area', locationData.area);
    if (locationData.pincode) {
      setValue('pincode', locationData.pincode);
    } else {
      const pin = extractPincode(locationData.address || locationData.formattedAddress);
      if (pin) setValue('pincode', pin);
    }
    setValue('address', locationData.address);
    if (locationData.landmark) setValue('landmark', locationData.landmark);
    setHasDealerCoords(true);
    setLocationError('');
    setShowMapPicker(false);
  }

  async function handleUseCurrentLocation(){
    if (!navigator.geolocation){
      setLocationError('Your browser does not support location. Please type your city or address.');
      return;
    }
    setLocationError('');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords || {};
        if (typeof latitude === 'number' && typeof longitude === 'number'){
          setValue('dealerLocation.latitude', latitude.toString(), { shouldValidate: true });
          setValue('dealerLocation.longitude', longitude.toString(), { shouldValidate: true });
          setHasDealerCoords(true);
          
          // Reverse geocode to get address
          const addressData = await reverseGeocode(latitude, longitude);
          if (addressData) {
            setValue('dealerLocation.address', addressData.formattedAddress);
            setValue('state', addressData.state);
            setValue('district', addressData.district);
            setValue('area', addressData.area);
            if (addressData.pincode) {
              setValue('pincode', addressData.pincode);
            } else {
              const pin = extractPincode(addressData.address || addressData.formattedAddress);
              if (pin) setValue('pincode', pin);
            }
            setValue('address', addressData.address);
            if (addressData.landmark) setValue('landmark', addressData.landmark);
          }
        } else {
          setLocationError('Could not read coordinates from your device. Please type your city or address.');
        }
        setLocating(false);
      },
      (err) => {
        console.error('geolocation error', err);
        if (err.code === 1) setLocationError('Location permission was denied. Please type your city or address.');
        else setLocationError('Unable to detect your location. Please type your city or address.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  async function onSubmit(data){
    try{
      if (!isBulk){
        const lat = data?.dealerLocation?.latitude;
        const lng = data?.dealerLocation?.longitude;
        const hasCoords = lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
        if (!hasCoords){
          setLocationError('Location is required when you choose "Be a dealer". Use current location or type your city/address.');
          return;
        }
      }

      setSubmitting(true);
      await api.post('/dealers', data);
      await Swal.fire({ title: 'Submitted', text: 'We will contact you shortly.', icon: 'success', confirmButtonText: 'OK' });
    }catch(err){
      console.error(err);
      const msg = err?.response?.status === 409
        ? 'An application with this email has already been submitted as a dealer.'
        : (err?.response?.data?.message || 'Please try again later.');
      await Swal.fire({ title: 'Failed', text: msg, icon: 'error', confirmButtonText: 'OK' });
    } finally {
      setSubmitting(false);
    }
  }

  const labels="block text-sm font-medium md:text-md";
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-8 max-w-3xl mt-20">
        <h1 className="text-2xl font-semibold md:text-3xl">Business Enquiry</h1>
        <form onSubmit={handleSubmit(onSubmit)} aria-busy={submitting ? 'true' : 'false'} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium md:text-md">Company Name</label>
            <input {...register('companyName')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium md:text-md">Name<span className="text-red-600">*</span></label>
            <input {...register('contactName', { required: 'Name is required' })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
            {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium md:text-md">Email<span className="text-red-600">*</span></label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Enter a valid email' }
                })}
                placeholder="email"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium md:text-md">Phone<span className="text-red-600">*</span></label>
              <input
                {...register('phone', {
                  required: 'Phone is required',
                  minLength: { value: 7, message: 'Phone seems too short' }
                })}
                placeholder="phone"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Enquiry type */}
          <div>
            <label className="block text-sm font-medium md:text-md">I want to</label>
            <select
              {...register('enquiryType')}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="dealer">Be a dealer</option>
              <option value="bulk">Buy in bulk</option>
            </select>
          </div>

          {/* Location section - only for dealer enquiries */}
          {!isBulk && (
            <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:px-4 md:py-4 space-y-3">
              <h2 className="text-sm md:text-base font-semibold">Location</h2>
              <p className="text-xs text-slate-600">We use your location only to show your dealership on the public dealers map.</p>
              
              {hasDealerCoords ? (
                <div className="space-y-2">
                  <div className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">
                    ✓ Location captured successfully
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={locating}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-brand px-3 py-2 text-xs md:text-sm text-brand hover:bg-brand hover:text-white disabled:opacity-60"
                    >
                      {locating ? 'Detecting…' : 'Use Current Location Again'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-brand px-3 py-2 text-xs md:text-sm text-brand hover:bg-brand hover:text-white"
                    >
                      Select from Map
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-white hover:text-brand border-2 border-brand disabled:opacity-60"
                  >
                    {locating ? 'Detecting…' : 'Use Current Location'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border-2 border-brand px-4 py-3 text-sm font-medium text-brand hover:bg-brand hover:text-white"
                  >
                    Select from Map
                  </button>
                </div>
              )}
              
              {locationError && (
                <p className="text-xs text-red-600">{locationError}</p>
              )}
              
              {/* Hidden fields just so RHF keeps them in the form data */}
              <input type="hidden" {...register('dealerLocation.latitude')} />
              <input type="hidden" {...register('dealerLocation.longitude')} />
            </section>
          )}

          <div className="grid gap-3">
            <label className="text-sm font-medium">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input 
                  {...register('state', { required: 'State is required' })} 
                  placeholder="State*" 
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" 
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
              </div>
              <div>
                <input 
                  {...register('district', { required: 'District is required' })} 
                  placeholder="District*" 
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" 
                />
                {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
              </div>
              <input 
                {...register('pincode')} 
                placeholder="Pincode" 
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand sm:col-span-2" 
              />
              <div className="sm:col-span-2">
                <input 
                  {...register('address', { required: 'Address is required' })} 
                  placeholder="Address*" 
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" 
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>
              <input 
                {...register('landmark')} 
                placeholder="Landmark" 
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand sm:col-span-2" 
              />
            </div>
          </div>

          {isBulk && (
            <div>
              <label className="block text-sm font-medium md:text-md">Expected Volume<span className="text-red-600">*</span></label>
              <input
                {...register('volumeBand', { validate: (v)=> (isBulk ? !!v?.trim() : true) || 'Expected volume is required' })}
                placeholder="e.g., 1000 units/month"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.volumeBand && <p className="mt-1 text-sm text-red-600">{errors.volumeBand.message}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium md:text-md">Message</label>
            <textarea {...register('message')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="pt-2">
            <button disabled={submitting} className="rounded-md bg-brand px-4 py-2 text-white disabled:opacity-60 inline-flex items-center gap-2">
              {submitting && <span className="h-4 w-4 rounded-full bg-gradient-to-tr from-accent to-attention p-[1px] animate-spin-slow"><span className="block h-full w-full rounded-full bg-transparent"></span></span>}
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      </main>
      <Footer />
      
      {/* Map Picker Modal */}
      {showMapPicker && (
        <MapPicker
          onLocationSelect={handleMapLocationSelect}
          onClose={() => setShowMapPicker(false)}
          initialPosition={hasDealerCoords ? [
            parseFloat(watch('dealerLocation.latitude')),
            parseFloat(watch('dealerLocation.longitude'))
          ] : null}
        />
      )}
    </div>
  );
}
