#!/usr/bin/env node

// Simple script to populate Supabase with mock data
const { execSync } = require('child_process');

console.log('🚀 Starting Supabase population...');

try {
  // Run the population script
  execSync('node scripts/populate-supabase.js', { stdio: 'inherit' });
  console.log('✅ Supabase population completed successfully!');
} catch (error) {
  console.error('❌ Error running population script:', error.message);
  process.exit(1);
}