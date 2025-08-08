<script>
    // Function to add 'visible' class to paragraphs in batches
    function revealText() {
        const paragraphs = document.querySelectorAll('.scroll-text');
        const batchSize = 1; // number of lines to reveal at once
        let counter = 0;

        paragraphs.forEach((paragraph, index) => {
            if (isElementInViewport(paragraph)) {
                if (counter < batchSize || index === paragraphs.length - 1) {
                    paragraph.classList.add('visible');
                    counter++;
                } else {
                    counter = 0;
                }
            }
        });
    }

    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Trigger revealText when scrolling
    window.addEventListener('scroll', revealText);

    // Resume download button click
    document.getElementById('resume-button').addEventListener('click', function () {
        window.open('./media/Nirrav Sawla Resume.docx', '_blank');
    });

    // Run once when page loads
    revealText();
</script>
