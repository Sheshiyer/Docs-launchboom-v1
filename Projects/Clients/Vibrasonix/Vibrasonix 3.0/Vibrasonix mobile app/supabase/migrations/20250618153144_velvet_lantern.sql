-- Insert sample albums with properly formatted UUIDs
INSERT INTO albums (id, title, artist, artwork_url, description, science_data, release_date, is_premium) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Binaural Bliss',
  'Frequency Masters',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
  'Experience deep relaxation through scientifically crafted binaural beats designed to synchronize your brainwaves.',
  'Binaural beats at 40Hz have been shown to enhance gamma wave activity, promoting focus and cognitive function. Research indicates that listening to these frequencies can improve attention span and reduce anxiety levels.',
  '2024-01-15',
  false
),
(
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '432 Hz Healing',
  'Sacred Frequencies',
  'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg',
  'Tuned to the universal frequency of 432 Hz, these tracks promote natural healing and harmony.',
  '432 Hz is mathematically consistent with the patterns of the universe and may have healing properties. This frequency is believed to resonate with the natural vibration of the Earth.',
  '2024-02-20',
  true
),
(
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'Solfeggio Frequencies',
  'Ancient Harmonics',
  'https://images.pexels.com/photos/6148926/pexels-photo-6148926.jpeg',
  'Ancient healing frequencies used in Gregorian chants, now scientifically proven to promote wellness.',
  'Solfeggio frequencies are specific tones that were used in ancient Gregorian chants. Modern research suggests these frequencies can promote healing and spiritual development.',
  '2024-03-10',
  false
),
(
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Deep Sleep Sanctuary',
  'Sleep Science Lab',
  'https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg',
  'Specially designed soundscapes to guide you into deep, restorative sleep using delta wave frequencies.',
  'Delta waves (0.5-4 Hz) are associated with the deepest stages of sleep. These frequencies help promote physical healing, immune system strengthening, and memory consolidation.',
  '2024-04-05',
  true
),
(
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Focus Flow State',
  'Productivity Labs',
  'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
  'Enhance concentration and enter flow state with beta and gamma wave frequencies designed for peak performance.',
  'Beta waves (13-30 Hz) and gamma waves (30-100 Hz) are associated with heightened focus, problem-solving, and creative thinking. These frequencies can help improve cognitive performance and sustained attention.',
  '2024-04-20',
  false
);

-- Insert sample tracks for Binaural Bliss
INSERT INTO tracks (id, album_id, title, artist, duration, audio_url, frequency, description, track_number, is_premium) VALUES
(
  '11a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Alpha Waves Meditation',
  'Frequency Masters',
  600,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '8-12 Hz',
  'Alpha waves promote relaxation and creative thinking, perfect for meditation sessions',
  1,
  false
),
(
  '12a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Theta Deep Sleep',
  'Frequency Masters',
  1800,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '4-8 Hz',
  'Theta waves facilitate deep sleep and REM cycles for restorative rest',
  2,
  false
),
(
  '13a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Beta Focus Enhancement',
  'Frequency Masters',
  900,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '13-30 Hz',
  'Beta waves enhance concentration and cognitive performance',
  3,
  false
),
(
  '14a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Gamma Consciousness',
  'Frequency Masters',
  720,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '40 Hz',
  'Gamma waves associated with heightened awareness and consciousness',
  4,
  false
);

-- Insert sample tracks for 432 Hz Healing
INSERT INTO tracks (id, album_id, title, artist, duration, audio_url, frequency, description, track_number, is_premium) VALUES
(
  '21b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Heart Chakra Healing',
  'Sacred Frequencies',
  900,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '432 Hz',
  'Opens and balances the heart chakra for emotional healing',
  1,
  true
),
(
  '22b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Root Chakra Grounding',
  'Sacred Frequencies',
  1200,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '432 Hz',
  'Grounds and stabilizes your energy through root chakra activation',
  2,
  true
),
(
  '23b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Solar Plexus Power',
  'Sacred Frequencies',
  840,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '432 Hz',
  'Activates personal power and confidence through solar plexus chakra',
  3,
  true
);

-- Insert sample tracks for Solfeggio Frequencies
INSERT INTO tracks (id, album_id, title, artist, duration, audio_url, frequency, description, track_number, is_premium) VALUES
(
  '31c3d4e5-f6a7-8901-bcde-f23456789012',
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  '528 Hz Love Frequency',
  'Ancient Harmonics',
  1080,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '528 Hz',
  'The frequency of love and DNA repair, promoting transformation',
  1,
  false
),
(
  '32c3d4e5-f6a7-8901-bcde-f23456789012',
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  '396 Hz Liberation',
  'Ancient Harmonics',
  960,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '396 Hz',
  'Liberates guilt and fear, promoting emotional freedom',
  2,
  false
),
(
  '33c3d4e5-f6a7-8901-bcde-f23456789012',
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  '741 Hz Expression',
  'Ancient Harmonics',
  900,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '741 Hz',
  'Enhances self-expression and creative problem-solving',
  3,
  false
),
(
  '34c3d4e5-f6a7-8901-bcde-f23456789012',
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  '852 Hz Intuition',
  'Ancient Harmonics',
  1020,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '852 Hz',
  'Awakens intuition and spiritual insight',
  4,
  false
);

-- Insert sample tracks for Deep Sleep Sanctuary
INSERT INTO tracks (id, album_id, title, artist, duration, audio_url, frequency, description, track_number, is_premium) VALUES
(
  '41d4e5f6-a7b8-9012-cdef-345678901234',
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Delta Wave Deep Sleep',
  'Sleep Science Lab',
  3600,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '0.5-4 Hz',
  'Pure delta waves for the deepest sleep stages',
  1,
  true
),
(
  '42d4e5f6-a7b8-9012-cdef-345678901234',
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Ocean Dreams',
  'Sleep Science Lab',
  2700,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '2 Hz',
  'Gentle ocean sounds with embedded delta frequencies',
  2,
  true
),
(
  '43d4e5f6-a7b8-9012-cdef-345678901234',
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Forest Night',
  'Sleep Science Lab',
  3000,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '1.5 Hz',
  'Peaceful forest ambience with sleep-inducing frequencies',
  3,
  true
);

-- Insert sample tracks for Focus Flow State
INSERT INTO tracks (id, album_id, title, artist, duration, audio_url, frequency, description, track_number, is_premium) VALUES
(
  '51e5f6a7-b8c9-0123-defa-456789012345',
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Beta Wave Concentration',
  'Productivity Labs',
  1500,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '20 Hz',
  'Optimal beta frequency for sustained concentration',
  1,
  false
),
(
  '52e5f6a7-b8c9-0123-defa-456789012345',
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Gamma Peak Performance',
  'Productivity Labs',
  1200,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '40 Hz',
  'Gamma waves for peak cognitive performance',
  2,
  false
),
(
  '53e5f6a7-b8c9-0123-defa-456789012345',
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Creative Flow',
  'Productivity Labs',
  1800,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '10 Hz',
  'Alpha-beta bridge frequency for creative thinking',
  3,
  false
),
(
  '54e5f6a7-b8c9-0123-defa-456789012345',
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Study Session',
  'Productivity Labs',
  2400,
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  '15 Hz',
  'Perfect frequency for learning and memory retention',
  4,
  false
);