# PastTense Frontend

A React TypeScript frontend for the PastTense semantic search application, built with Tailwind CSS for modern, responsive UI.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- PastTense FastAPI backend running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎯 Features

### Search Pages Tab
- **Semantic Search**: Find pages using natural language queries
- **Configurable Results**: Choose between 3, 5, 10, or 20 results
- **Real-time Search**: Instant results with loading indicators
- **Result Display**: Clean cards showing page titles, domains, and favicons
- **External Links**: Direct access to original pages

### Add Page Visit Tab
- **Manual Entry**: Add page visits with URL, title, and content
- **Auto-timestamp**: Automatic timestamp generation
- **Form Validation**: Required field validation and URL format checking
- **Success Feedback**: Clear success/error messaging
- **Auto-reset**: Form clears after successful submission

## 🎨 UI Components

### Main Features
- **Tab Navigation**: Clean tab interface between search and add functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Spinner animations during API calls
- **Error Handling**: User-friendly error messages
- **Modern Styling**: Tailwind CSS with clean, minimal design

### Color Scheme
- **Primary**: Blue gradient background
- **Cards**: White with subtle shadows
- **Text**: Gray scale hierarchy
- **Accents**: Blue for actions, green for success, red for errors

## 🔧 Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **Lucide React**: Modern icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AddPageVisit.tsx    # Form for adding page visits
│   │   ├── SearchPages.tsx     # Search interface
│   │   └── ResultsList.tsx     # Search results display
│   ├── api.ts                  # API service functions
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind CSS imports
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🌐 API Integration

The frontend communicates with the FastAPI backend through three main endpoints:

### Store Page Visit
- **Endpoint**: `POST /page_visit`
- **Purpose**: Add new page visits to the database and vector store
- **Component**: `AddPageVisit.tsx`

### Semantic Search
- **Endpoint**: `POST /semantic_search`
- **Purpose**: Find similar pages using AI embeddings
- **Component**: `SearchPages.tsx`

### Show Results
- **Endpoint**: `POST /show_results`
- **Purpose**: Get detailed page information for search results
- **Component**: `ResultsList.tsx`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

The frontend is configured to proxy API requests to `http://localhost:8000` during development. No environment variables are required.

## 📱 Responsive Design

The interface adapts to different screen sizes:

- **Desktop**: Full-width layout with optimal spacing
- **Tablet**: Responsive grid and adjusted padding
- **Mobile**: Single-column layout with touch-friendly controls

## 🎭 User Experience

### Visual Feedback
- Loading spinners for async operations
- Color-coded status messages (green for success, red for errors)
- Hover effects on interactive elements
- Disabled states for invalid actions

### Form Validation
- Required field indicators
- URL format validation
- Real-time form state management
- Clear error messaging

### Search Experience
- Placeholder text with example queries
- Configurable result count
- No results messaging
- Quick external link access

## 🔍 Search Tips

To get the best search results:

1. **Use natural language**: "machine learning tutorials" works better than "ML"
2. **Be specific**: Include context like "cooking recipes" or "programming guides"
3. **Try variations**: Different phrasings may yield different results
4. **Adjust result count**: More results give broader coverage

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start:**
- Ensure Node.js 16+ is installed
- Run `npm install` to install dependencies
- Check that port 5173 is available

**API calls fail:**
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure OpenAI API key is configured in backend

**No search results:**
- Verify pages have been added to the database
- Try different search terms
- Check backend logs for embedding errors

### Browser Compatibility

Supports all modern browsers:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+ 