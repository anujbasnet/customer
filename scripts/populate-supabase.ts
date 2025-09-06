import { createClient } from '@supabase/supabase-js';
import { categories } from '../mocks/categories';
import { businesses } from '../mocks/businesses';
import { cities } from '../mocks/cities';
import { promotions } from '../mocks/promotions';

const supabaseUrl = 'https://bmgmoygwnscrllwmdbul.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZ21veWd3bnNjcmxsd21kYnVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDAyODU3MywiZXhwIjoyMDY5NjA0NTczfQ.PEBp9KcOgTrQyraK6-x4xDfsisDLn00NZvj4hmdufuU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categoryNameMap: { [key: string]: string } = {
  'hairSalon': '1',
  'barber': '2', 
  'nailSalon': '3',
  'football': '4',
  'spa': '5',
  'massage': '6',
  'dental': '7',
  'fitness': '8'
};

async function populateSupabase() {
  console.log('Starting Supabase population...');

  try {
    // 1. Insert cities
    console.log('Inserting cities...');
    const { error: citiesError } = await supabase
      .from('cities')
      .upsert(cities.map(city => ({
        id: city.id,
        name: city.name,
        name_ru: city.nameRu,
        name_uz: city.nameUz
      })), { onConflict: 'id' });
    
    if (citiesError) {
      console.error('Error inserting cities:', citiesError);
      return;
    }
    console.log('Cities inserted successfully');

    // 2. Insert categories
    console.log('Inserting categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        image: category.image
      })), { onConflict: 'id' });
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }
    console.log('Categories inserted successfully');

    // 3. Insert businesses
    console.log('Inserting businesses...');
    const businessesData = businesses.map(business => ({
      id: business.id,
      name: business.name,
      category_id: categoryNameMap[business.category] || business.category,
      city_id: business.cityId,
      address: business.address,
      address_ru: business.addressRu,
      address_uz: business.addressUz,
      phone: business.phone,
      email: business.email,
      description: business.description,
      description_ru: business.descriptionRu,
      description_uz: business.descriptionUz,
      rating: business.rating,
      review_count: business.reviewCount,
      image: business.image,
      latitude: business.latitude,
      longitude: business.longitude,
      working_hours: business.workingHours
    }));

    const { error: businessesError } = await supabase
      .from('businesses')
      .upsert(businessesData, { onConflict: 'id' });
    
    if (businessesError) {
      console.error('Error inserting businesses:', businessesError);
      return;
    }
    console.log('Businesses inserted successfully');

    // 4. Insert employees
    console.log('Inserting employees...');
    const employeesData = businesses.flatMap(business => 
      business.employees.map(employee => ({
        id: employee.id,
        business_id: business.id,
        name: employee.name,
        position: employee.position,
        image: employee.image
      }))
    );

    const { error: employeesError } = await supabase
      .from('employees')
      .upsert(employeesData, { onConflict: 'id' });
    
    if (employeesError) {
      console.error('Error inserting employees:', employeesError);
      return;
    }
    console.log('Employees inserted successfully');

    // 5. Insert services
    console.log('Inserting services...');
    const servicesData = businesses.flatMap(business => 
      business.services.map(service => ({
        id: service.id,
        business_id: business.id,
        name: service.name,
        name_ru: service.nameRu || null,
        name_uz: service.nameUz || null,
        description: service.description,
        description_ru: service.descriptionRu || null,
        description_uz: service.descriptionUz || null,
        duration: service.duration,
        price: service.price
      }))
    );

    const { error: servicesError } = await supabase
      .from('services')
      .upsert(servicesData, { onConflict: 'id' });
    
    if (servicesError) {
      console.error('Error inserting services:', servicesError);
      return;
    }
    console.log('Services inserted successfully');

    // 6. Insert portfolio items
    console.log('Inserting portfolio items...');
    const portfolioData = businesses.flatMap(business => 
      (business.portfolio || []).map(item => ({
        id: item.id,
        business_id: business.id,
        title: item.title,
        image: item.image,
        description: item.description || null
      }))
    );

    if (portfolioData.length > 0) {
      const { error: portfolioError } = await supabase
        .from('portfolio_items')
        .upsert(portfolioData, { onConflict: 'id' });
      
      if (portfolioError) {
        console.error('Error inserting portfolio items:', portfolioError);
        return;
      }
      console.log('Portfolio items inserted successfully');
    }

    // 7. Insert promotions
    console.log('Inserting promotions...');
    const promotionsData = promotions.map(promotion => {
      const discountPercentage = parseInt(promotion.discount.replace('%', '')) || 0;
      return {
        id: promotion.id,
        business_id: promotion.businessId,
        title: promotion.title,
        description: promotion.description,
        discount_percentage: discountPercentage,
        valid_from: '2025-01-01',
        valid_until: promotion.validUntil,
        is_active: true
      };
    });

    const { error: promotionsError } = await supabase
      .from('promotions')
      .upsert(promotionsData, { onConflict: 'id' });
    
    if (promotionsError) {
      console.error('Error inserting promotions:', promotionsError);
      return;
    }
    console.log('Promotions inserted successfully');

    // 8. Generate time slots for next 30 days
    console.log('Generating time slots...');
    const timeSlots = [];
    const today = new Date();
    
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateString = date.toISOString().split('T')[0];
      
      for (const business of businesses) {
        // Generate slots from 9 AM to 6 PM with 1-hour intervals
        for (let hour = 9; hour < 18; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
          timeSlots.push({
            business_id: business.id,
            date: dateString,
            time: timeString,
            is_available: Math.random() > 0.3 // 70% chance of being available
          });
        }
      }
    }

    // Insert time slots in batches to avoid timeout
    const batchSize = 1000;
    for (let i = 0; i < timeSlots.length; i += batchSize) {
      const batch = timeSlots.slice(i, i + batchSize);
      const { error: timeSlotsError } = await supabase
        .from('time_slots')
        .upsert(batch, { onConflict: 'business_id,date,time' });
      
      if (timeSlotsError) {
        console.error('Error inserting time slots batch:', timeSlotsError);
        return;
      }
      console.log(`Time slots batch ${Math.floor(i / batchSize) + 1} inserted`);
    }
    console.log('Time slots generated successfully');

    console.log('✅ Supabase population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating Supabase:', error);
  }
}

populateSupabase();