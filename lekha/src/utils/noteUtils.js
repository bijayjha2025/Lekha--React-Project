
export const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const tagColors = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
];

export const getTagColor = (tag) => {
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[index % tagColors.length];
};

export const filterNotes = (notes, searchQuery, selectedTag) => {
  return notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const plainContent = stripHtml(note.content  || '');
    const matchesSearch = 
      (note.title || '').toLowerCase().includes(searchLower) || 
      plainContent.toLowerCase().includes(searchLower);
    const matchesTag = 
      !selectedTag || 
      selectedTag === 'all' || 
      (note.tags || []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });
};

export const sortNotes = (notes, sortBy) => {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned ? 1 : -1;
    }

    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title':
        return (a.title || '').localeCompare(b.title);
      default:
        return 0;
    }
  });
};

export const getTextStats = (content) => {
  const cleanText = stripHtml(content);
  const charCount = cleanText.length;
  const wordCount = cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  return { charCount, wordCount };
};