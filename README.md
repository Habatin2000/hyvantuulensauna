# Hyvän Tuulen Sauna

A brand new Finnish-first website for Hyvän Tuulen Sauna - a sauna boat experience in Helsinki.

## Features

- **Next.js App Router** with TypeScript
- **Modern Design** with warm maritime aesthetic
- **Three Product Lines**:
  - Summer sauna boats (primary)
  - Private sauna bookings
  - Public sauna sessions
- **Booking UX Shells** - Ready for backend integration
- **Finnish-first** content
- **Fully Responsive** design

## Project Structure

```
my-app/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── saunalautat-kesalla/  # Summer sauna boats
│   ├── yksityissauna/        # Private sauna
│   ├── julkinen-sauna/       # Public sauna
│   ├── sijainti/             # Location
│   ├── usein-kysyttya/       # FAQ
│   ├── galleria/             # Gallery
│   └── kiitos/               # Thank you
├── components/
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Reusable page sections
│   ├── booking/           # Booking shell components
│   └── ui/                # shadcn/ui components
├── content/               # Content data files
├── types/                 # TypeScript types
└── public/images/         # Static images
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Pages

- `/` - Homepage with summer focus
- `/saunalautat-kesalla` - Summer sauna boats (main product)
- `/yksityissauna` - Private sauna bookings
- `/julkinen-sauna` - Public sauna sessions
- `/sijainti` - Location and directions
- `/usein-kysyttya` - FAQ page
- `/galleria` - Photo gallery
- `/kiitos` - Thank you / confirmation

## Design System

- **Colors**: Warm stone palette with ocean teal accents
- **Typography**: Clean, modern sans-serif
- **Visual Style**: Maritime, warm, Finnish, premium but approachable

## TODO for Future Development

1. Implement actual booking backend integration
2. Add real calendar/date picker components
3. Connect to payment provider
4. Add email notifications
5. Implement user authentication (if needed)
6. Add image optimization
7. SEO improvements
8. Analytics integration
