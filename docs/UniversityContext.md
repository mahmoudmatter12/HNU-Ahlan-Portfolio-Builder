# University Context Documentation

This document describes the comprehensive university context system that provides university-related functionality throughout the application.

## Overview

The `UniversityContext` provides a centralized way to manage university data, including fetching, updating, deleting, and managing university information with proper error handling, loading states, and verification processes.

## Features

### Core Functionality

- **Data Management**: Fetch, update, and delete university information
- **Social Media Management**: Update social media links
- **Statistics**: Get university statistics (colleges, users, sections, forms)
- **Verification System**: Handle two-step verification for updates and three-step verification for deletions
- **Error Handling**: Comprehensive error handling with toast notifications
- **Loading States**: Track loading states for all operations
- **Caching**: Automatic caching with React Query

## Provider Setup

The `UniversityProvider` is automatically included in the global providers. It wraps the application and provides university context to all child components.

```tsx
// Already configured in context/proiders.tsx
<UniversityProvider>{children}</UniversityProvider>
```

## Main Hook

### `useUniversity()`

The main hook that provides access to all university context functionality.

```tsx
import { useUniversity } from "@/context/universityContext";

function MyComponent() {
  const {
    university,
    loading,
    error,
    updateUniversity,
    deleteUniversity,
    updateSocialMedia,
    getUniversityStats,
    // ... all other properties
  } = useUniversity();

  // Use the context
}
```

## Convenience Hooks

### Data Access Hooks

#### `useUniversityData()`

Returns the current university data.

```tsx
import { useUniversityData } from "@/context/universityContext";

function MyComponent() {
  const university = useUniversityData();

  if (!university) return <div>No university data</div>;

  return <div>{university.name}</div>;
}
```

#### `useUniversityLoading()`

Returns the loading state.

```tsx
import { useUniversityLoading } from "@/context/universityContext";

function MyComponent() {
  const loading = useUniversityLoading();

  if (loading) return <div>Loading...</div>;

  return <div>Content loaded</div>;
}
```

#### `useUniversityError()`

Returns any error that occurred.

```tsx
import { useUniversityError } from "@/context/universityContext";

function MyComponent() {
  const error = useUniversityError();

  if (error) return <div>Error: {error}</div>;

  return <div>No errors</div>;
}
```

### Statistics Hook

#### `useUniversityStats()`

Returns university statistics.

```tsx
import { useUniversityStats } from "@/context/universityContext";

function StatsComponent() {
  const stats = useUniversityStats();

  return (
    <div>
      <p>Colleges: {stats.collegesCount}</p>
      <p>Users: {stats.totalUsers}</p>
      <p>Sections: {stats.totalSections}</p>
      <p>Forms: {stats.totalForms}</p>
    </div>
  );
}
```

### Update Operations Hook

#### `useUniversityUpdate()`

Provides update functionality with loading state.

```tsx
import { useUniversityUpdate } from "@/context/universityContext";

function UpdateForm() {
  const { updateUniversity, updateUniversityLoading } = useUniversityUpdate();

  const handleSubmit = async (data) => {
    try {
      await updateUniversity({
        name: data.name,
        description: data.description,
        verificationStep: "request",
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={updateUniversityLoading}>
        {updateUniversityLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
```

### Delete Operations Hook

#### `useUniversityDelete()`

Provides delete functionality with loading state.

```tsx
import { useUniversityDelete } from "@/context/universityContext";

function DeleteButton() {
  const { deleteUniversity, deleteUniversityLoading } = useUniversityDelete();

  const handleDelete = async () => {
    try {
      await deleteUniversity({
        verificationStep: "initiate",
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteUniversityLoading}>
      {deleteUniversityLoading ? "Deleting..." : "Delete University"}
    </button>
  );
}
```

### Social Media Hook

#### `useUniversitySocialMedia()`

Provides social media management functionality.

```tsx
import { useUniversitySocialMedia } from "@/context/universityContext";

function SocialMediaManager() {
  const { updateSocialMedia, socialMedia } = useUniversitySocialMedia();

  const handleUpdate = async (newLinks) => {
    try {
      await updateSocialMedia(newLinks);
    } catch (error) {
      console.error("Social media update failed:", error);
    }
  };

  return (
    <div>
      <p>Current social media: {JSON.stringify(socialMedia)}</p>
      <button onClick={() => handleUpdate({ facebook: "new-url" })}>
        Update Facebook
      </button>
    </div>
  );
}
```

### Verification Hooks

#### `useUniversityVerification()`

Manages verification codes for update operations.

```tsx
import { useUniversityVerification } from "@/context/universityContext";

function VerificationForm() {
  const {
    verificationCode,
    setVerificationCode,
    generatedCode,
    setGeneratedCode,
  } = useUniversityVerification();

  return (
    <div>
      <p>Generated Code: {generatedCode}</p>
      <input
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter verification code"
      />
    </div>
  );
}
```

#### `useUniversityDeleteVerification()`

Manages verification codes for delete operations.

```tsx
import { useUniversityDeleteVerification } from "@/context/universityContext";

function DeleteVerificationForm() {
  const {
    deleteVerificationCode,
    setDeleteVerificationCode,
    deleteGeneratedCode,
    setDeleteGeneratedCode,
    finalConfirmation,
    setFinalConfirmation,
    deleteStats,
    setDeleteStats,
  } = useUniversityDeleteVerification();

  return (
    <div>
      <p>Delete Stats: {JSON.stringify(deleteStats)}</p>
      <p>Generated Code: {deleteGeneratedCode}</p>
      <input
        value={deleteVerificationCode}
        onChange={(e) => setDeleteVerificationCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <input
        value={finalConfirmation}
        onChange={(e) => setFinalConfirmation(e.target.value)}
        placeholder="Type DELETE_UNIVERSITY_HNU"
      />
    </div>
  );
}
```

## Usage Examples

### Complete University Management Component

```tsx
import { useUniversity } from "@/context/universityContext";

function UniversityManager() {
  const {
    university,
    loading,
    error,
    updateUniversity,
    deleteUniversity,
    getUniversityStats,
    verificationCode,
    setVerificationCode,
    generatedCode,
  } = useUniversity();

  const stats = getUniversityStats();

  if (loading) return <div>Loading university data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!university) return <div>No university found</div>;

  const handleUpdate = async () => {
    try {
      // Step 1: Request verification
      const response = await updateUniversity({
        name: university.name,
        description: "Updated description",
        verificationStep: "request",
      });

      // Step 2: Verify with code
      await updateUniversity({
        name: university.name,
        description: "Updated description",
        verificationStep: "verify",
        verificationCode: verificationCode,
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div>
      <h1>{university.name}</h1>
      <p>{university.description}</p>

      <div>
        <h2>Statistics</h2>
        <p>Colleges: {stats.collegesCount}</p>
        <p>Users: {stats.totalUsers}</p>
        <p>Sections: {stats.totalSections}</p>
        <p>Forms: {stats.totalForms}</p>
      </div>

      <div>
        <h2>Update University</h2>
        {generatedCode && <p>Verification Code: {generatedCode}</p>}
        <input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}
```

### Social Media Management Component

```tsx
import { useUniversitySocialMedia } from "@/context/universityContext";

function SocialMediaManager() {
  const { updateSocialMedia, socialMedia } = useUniversitySocialMedia();
  const [links, setLinks] = useState(socialMedia || {});

  const handleSave = async () => {
    try {
      await updateSocialMedia(links);
    } catch (error) {
      console.error("Failed to update social media:", error);
    }
  };

  const updateLink = (platform: string, url: string) => {
    setLinks((prev) => ({
      ...prev,
      [platform]: url,
    }));
  };

  return (
    <div>
      <h2>Social Media Links</h2>

      <div>
        <label>Facebook:</label>
        <input
          value={links.facebook || ""}
          onChange={(e) => updateLink("facebook", e.target.value)}
        />
      </div>

      <div>
        <label>Twitter:</label>
        <input
          value={links.twitter || ""}
          onChange={(e) => updateLink("twitter", e.target.value)}
        />
      </div>

      <button onClick={handleSave}>Save Social Media Links</button>
    </div>
  );
}
```

## Error Handling

The context automatically handles errors and displays toast notifications. All operations that can fail will throw errors that you can catch:

```tsx
try {
  await updateUniversity(data);
  // Success - toast notification will be shown automatically
} catch (error) {
  // Error - toast notification will be shown automatically
  // You can also handle the error here if needed
  console.error("Custom error handling:", error);
}
```

## Loading States

All operations provide loading states that you can use to show loading indicators:

```tsx
const { updateUniversityLoading, deleteUniversityLoading } = useUniversity();

if (updateUniversityLoading) return <div>Updating...</div>;
if (deleteUniversityLoading) return <div>Deleting...</div>;
```

## Caching

The context uses React Query for caching with the following configuration:

- **Stale Time**: 5 minutes (data is considered fresh for 5 minutes)
- **GC Time**: 10 minutes (data is kept in cache for 10 minutes)

The cache is automatically invalidated when updates or deletions are successful.

## Verification System

The context supports the university's verification system:

### Update Verification (Two-Step)

1. **Request**: Call with `verificationStep: "request"`
2. **Verify**: Call with `verificationStep: "verify"` and the verification code

### Delete Verification (Three-Step)

1. **Initiate**: Call with `verificationStep: "initiate"`
2. **Verify**: Call with `verificationStep: "verify"` and the verification code
3. **Confirm**: Call with `verificationStep: "confirm"` and the final confirmation text

## Best Practices

1. **Use Specific Hooks**: Use the convenience hooks when you only need specific functionality
2. **Handle Loading States**: Always check loading states before rendering content
3. **Error Boundaries**: Wrap components that use the context in error boundaries
4. **Optimistic Updates**: The context handles cache invalidation automatically
5. **Verification Flow**: Follow the proper verification flow for sensitive operations

## TypeScript Support

The context is fully typed with TypeScript. All hooks and functions include proper type definitions for better development experience and error catching.
