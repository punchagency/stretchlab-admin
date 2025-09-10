export const downloadCSVTemplate = () => {
  const csvContent = "email\nflexologist1@example.com\nflexologist2@example.com";
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bulk_invite_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const parseCSVFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Skip header row and extract emails
        const emails = lines.slice(1).map(line => {
          const email = line.trim();
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            throw new Error(`Invalid email format: ${email}`);
          }
          return email;
        });

        // Remove duplicates
        const uniqueEmails = [...new Set(emails)];
        resolve(uniqueEmails);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
