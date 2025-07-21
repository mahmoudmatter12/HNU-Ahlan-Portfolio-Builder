# FAQ Management System

This document describes the comprehensive FAQ (Frequently Asked Questions) management system implemented for college websites. The system provides three different approaches for collecting and managing FAQ data.

## 🚀 Features

### 1. Three Data Collection Approaches

#### **Approach 1: Manual Entry**
- Add questions and answers individually through a user-friendly dialog
- Rich markdown editor for answers with full formatting support
- Real-time preview of markdown content
- Drag-and-drop reordering of FAQ items

#### **Approach 2: CSV/Excel Import**
- Upload CSV or Excel files with FAQ data
- Automatic validation of required columns (question, answer)
- Preview imported data before confirmation
- Support for markdown formatting in imported answers

#### **Approach 3: Automatic Form Generation**
- Generate forms with custom questions
- Collect answers from users through form submissions
- Review and approve submissions to add to FAQ
- Automatic integration with existing form system

### 2. Advanced Management Features

- **Drag-and-Drop Reordering**: Easily reorder FAQ items
- **Markdown Support**: Rich text formatting for answers
- **Bulk Operations**: Import multiple items at once
- **Submission Management**: Review and process form submissions
- **Statistics Dashboard**: View FAQ metrics and activity
- **Public Display**: Responsive FAQ display for public pages

## 📁 File Structure

```
components/_sharedforms/faq/
├── faq-management-dialog.tsx      # Main FAQ management interface
├── faq-item-dialog.tsx           # Add/edit individual FAQ items
├── faq-import-dialog.tsx         # CSV/Excel import functionality
├── faq-generation-dialog.tsx     # Form generation interface
├── faq-submissions-dialog.tsx    # Submission management
└── faq-display.tsx              # Public FAQ display component

types/
└── faq.ts                       # FAQ-related TypeScript interfaces

services/
└── faq-service.ts               # API service for FAQ operations

app/[locale]/api/collage/[id]/faq/
├── route.ts                     # Main FAQ CRUD operations
├── items/
│   └── route.ts                 # Individual item operations
├── items/[itemId]/
│   └── route.ts                 # Update/delete specific items
├── reorder/
│   └── route.ts                 # Reorder FAQ items
├── import/
│   └── route.ts                 # Import FAQ data
├── generate-form/
│   └── route.ts                 # Generate FAQ forms
└── submissions/
    ├── route.ts                 # Get FAQ submissions
    └── [submissionId]/
        └── route.ts             # Process submissions
```

## 🗄️ Database Schema

The FAQ system uses the existing `College` model with a JSON field:

```prisma
model College {
  // ... other fields
  faq Json? // Stores FAQData structure
}
```

### FAQ Data Structure

```typescript
interface FAQData {
  items: FAQItem[];
  title?: string;
  description?: string;
  lastUpdated: Date;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string; // Markdown content
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 API Endpoints

### Main FAQ Operations
- `GET /api/collage/[id]/faq` - Get FAQ data
- `PUT /api/collage/[id]/faq` - Update FAQ data

### Individual Items
- `POST /api/collage/[id]/faq/items` - Add new FAQ item
- `PUT /api/collage/[id]/faq/items/[itemId]` - Update FAQ item
- `DELETE /api/collage/[id]/faq/items/[itemId]` - Delete FAQ item

### Reordering
- `PUT /api/collage/[id]/faq/reorder` - Reorder FAQ items

### Import
- `POST /api/collage/[id]/faq/import` - Import FAQ from CSV/Excel

### Form Generation
- `POST /api/collage/[id]/faq/generate-form` - Generate FAQ form

### Submissions
- `GET /api/collage/[id]/faq/submissions` - Get FAQ submissions
- `PUT /api/collage/[id]/faq/submissions/[submissionId]` - Process submission

## 🎯 Usage Examples

### 1. Manual Entry

```tsx
import { FAQManagementDialog } from "@/components/_sharedforms/faq/faq-management-dialog"

function CollegeDashboard({ college }) {
  const [showFAQDialog, setShowFAQDialog] = useState(false)

  return (
    <div>
      <Button onClick={() => setShowFAQDialog(true)}>
        Manage FAQ
      </Button>
      
      <FAQManagementDialog
        open={showFAQDialog}
        onOpenChange={setShowFAQDialog}
        collegeId={college.id}
        collegeName={college.name}
      />
    </div>
  )
}
```

### 2. Public Display

```tsx
import { FAQDisplay } from "@/components/_sharedforms/faq/faq-display"

function PublicCollegePage({ college }) {
  return (
    <div>
      <FAQDisplay 
        faqData={college.faq}
        title="Frequently Asked Questions"
        description="Find answers to common questions"
      />
    </div>
  )
}
```

### 3. CSV Import Format

The CSV file should have the following structure:

```csv
question,answer
"What programs do you offer?","We offer:\n\n- Computer Science\n- Engineering\n- Business"
"How do I apply?","Follow these steps:\n\n1. Complete application\n2. Submit documents\n3. Pay fees"
```

## 🎨 UI Components

### FAQ Management Dialog
- **Tabs Interface**: Separate tabs for manage, import, and generate
- **Statistics Dashboard**: Shows total questions, last updated, etc.
- **Drag-and-Drop List**: Reorder FAQ items visually
- **Quick Actions**: Add, edit, delete items

### FAQ Item Dialog
- **Question Input**: Simple text input for questions
- **Markdown Editor**: Rich text editor for answers with preview
- **Validation**: Ensures required fields are filled

### FAQ Import Dialog
- **File Upload**: Drag-and-drop or click to upload
- **Preview**: Shows imported data before confirmation
- **Validation**: Checks file format and required columns
- **Instructions**: Clear guidance on file format

### FAQ Generation Dialog
- **Dynamic Questions**: Add/remove questions dynamically
- **Form Preview**: Shows how the generated form will look
- **Navigation**: Direct link to forms dashboard

### FAQ Submissions Dialog
- **Submission List**: Shows all pending submissions
- **Detail View**: Full submission details with markdown preview
- **Approve/Reject**: Process submissions to add to FAQ

### FAQ Display Component
- **Accordion Style**: Expandable questions and answers
- **Markdown Rendering**: Full markdown support for answers
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security & Validation

### Input Validation
- Question length limits (1-500 characters)
- Answer length limits (1-5000 characters)
- Required field validation
- File type validation for imports

### Data Sanitization
- Markdown content sanitization
- XSS protection
- SQL injection prevention

### Access Control
- College creator authentication
- Audit logging for all operations
- Role-based permissions

## 📊 Performance Considerations

### Caching
- React Query for client-side caching
- Optimistic updates for better UX
- Background refetching

### Optimization
- Lazy loading of FAQ components
- Virtual scrolling for large FAQ lists
- Image optimization for markdown content

## 🧪 Testing

### Demo Page
Visit `/faq-demo` to test all FAQ functionality:
- Manual entry and editing
- CSV import with sample data
- Form generation workflow
- Submission management
- Public display preview

### Sample Data
The demo includes sample FAQ items with:
- Different question types
- Rich markdown formatting
- Tables and lists
- Links and formatting

## 🚀 Future Enhancements

### Planned Features
- **FAQ Categories**: Organize questions by topic
- **Search Functionality**: Search within FAQ content
- **Analytics**: Track popular questions and user interactions
- **Multi-language Support**: Internationalization for FAQ content
- **FAQ Templates**: Pre-built FAQ templates for common use cases
- **Integration**: Connect with knowledge base systems

### Technical Improvements
- **Real-time Updates**: WebSocket support for live updates
- **Advanced Search**: Full-text search with filters
- **Export Options**: Export FAQ in various formats (PDF, Word, etc.)
- **API Rate Limiting**: Protect against abuse
- **Backup & Restore**: FAQ data backup functionality

## 📝 Best Practices

### Content Guidelines
- Keep questions clear and concise
- Use markdown formatting for better readability
- Update FAQ regularly based on user feedback
- Organize questions logically

### Technical Guidelines
- Use semantic HTML for accessibility
- Implement proper error handling
- Add loading states for better UX
- Test on multiple devices and browsers

### Performance Guidelines
- Optimize images in markdown content
- Use lazy loading for large FAQ lists
- Implement proper caching strategies
- Monitor performance metrics

## 🔧 Configuration

### Environment Variables
```env
# Optional: Customize markdown editor settings
NEXT_PUBLIC_MARKDOWN_EDITOR_HEIGHT=300
NEXT_PUBLIC_MARKDOWN_EDITOR_THEME=light
```

### Styling Customization
The FAQ components use Tailwind CSS and can be customized through:
- CSS custom properties
- Tailwind configuration
- Component prop overrides

## 📞 Support

For questions or issues with the FAQ system:
1. Check the demo page at `/faq-demo`
2. Review the API documentation
3. Check the browser console for errors
4. Verify file permissions and database connectivity 