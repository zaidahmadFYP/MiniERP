import React from 'react';
import IconButton from '@mui/material/IconButton';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Tooltip } from '@mui/material';

async function getBase64FromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const DownloadPDFButton = ({ cylinders, branchName }) => {
    const handleDownloadPDF = async () => {
        const doc = new jsPDF('p', 'pt');

        // Load the image and convert to base64
        const logoUrl = window.location.origin + '/images/muawin_monogram.png';
        let logoData;
        try {
            logoData = await getBase64FromUrl(logoUrl);
        } catch (error) {
            console.error('Error loading logo image:', error);
            // Proceed without image if there's an error
        }

        const title = "Cylinder Expiry Sheet";

        // Group cylinders by location
        const grouped = {};
        cylinders.forEach(cyl => {
            const { location, categories } = cyl;
            if (!grouped[location]) {
                grouped[location] = [];
            }
            categories.forEach(cat => {
                grouped[location].push({
                    category: cat.category,
                    weight: cat.weight,
                    date: new Date(cat.date).toLocaleDateString()
                });
            });
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        let currentY = 40;

        // Add "Generated Date and Time" at the top-right corner
        const now = new Date();
        const generatedDateTime = `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        doc.setFontSize(10);
        doc.text(generatedDateTime, pageWidth - 160, currentY); // Top-right corner
        currentY += 20;

        // If image loaded, add image at top center
        if (logoData) {
            const imgWidth = 80; // smaller image
            const imgHeight = 80;
            const imgX = (pageWidth - imgWidth) / 2;
            doc.addImage(logoData, 'WEBP', imgX, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 20; // space after image
        }

        // Center the title text
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 20;

        // If branchName, center it below the title
        if (branchName) {
            doc.setFontSize(12);
            const branchText = `Branch: ${branchName}`;
            const branchWidth = doc.getTextWidth(branchText);
            doc.text(branchText, (pageWidth - branchWidth) / 2, currentY);
            currentY += 30; // a bit more space before the tables
        }

        // Print each location and its categories
        Object.keys(grouped).forEach((location, index) => {
            const categoriesData = grouped[location];

            if (index > 0) {
                currentY += 20; // spacing before next location
            }

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            const locWidth = doc.getTextWidth(location);
            doc.text(location, (pageWidth - locWidth) / 2, currentY); // center the location name as well
            doc.setFont(undefined, 'normal');
            currentY += 10;

            const columns = ['Category', 'Weight', 'Expiry Date'];
            const rows = categoriesData.map(cat => [cat.category, cat.weight, cat.date]);

            // Create a table of categories for this location
            doc.autoTable({
                startY: currentY,
                head: [columns],
                body: rows,
                styles: { fontSize: 10, cellPadding: 8 },
                headStyles: { fillColor: [241, 90, 34], textColor: 255, halign: 'center' },
                bodyStyles: { halign: 'center' },
                theme: 'striped',
                margin: { left: 40, right: 40 },
            });

            const tableData = doc.autoTable.previous;
            currentY = tableData.finalY; // update currentY below the table
        });

        doc.save('cylinder_data.pdf');
    };

    return (
        <Tooltip title="Download PDF" arrow>
            <IconButton onClick={handleDownloadPDF} sx={{ color: '#f15a22' }}>
                <PictureAsPdfIcon />
            </IconButton>
        </Tooltip>
    );
};

export default DownloadPDFButton;
