(function() {
    // Configuration object for component mappings and settings
    const CONFIG = {
        // Base components that appear on every page
        baseComponents: [
            'header',
            'services-stats',
            'faces',
            'services-types',
            'portfolio',
            'footer'
        ],
        
        // Category-specific component configurations
        categoryConfigs: {
            programs: {
                hero: 'hero-programs',
                specific: ['list-programs', 'featured-programs']
            },
            people: {
                hero: 'hero-people',
                specific: ['list-people', 'featured-people']
            },
            blog: {
                hero: 'hero-blog',
                specific: ['blog-posts', 'featured-blog']
            },
            partners: {
                hero: 'hero-partners',
                specific: ['list-partners', 'featured-partners']
            },
            default: {
                hero: 'hero-default',
                specific: ['featured-default', 'call-to-action']
            }
        },
        
        // Coming soon configuration
        comingSoon: {
            hero: 'hero-comingsoon',
            specific: ['featured-people', 'call-to-action']
        },
        
        // Base path for components
        basePath: '/components/',
        
        // GTM configuration
        gtm: {
            id: 'G-VK4JWHDC1Z',
            domain: 'googletagmanager.com'
        }
    };

    class ComponentLoader {
        constructor() {
            this.loaderScript = document.getElementById("loaderScript");
            this.loadDraftComponents = false;
            this.jsonData = this.getJsonData();
            this.currentCategory = this.determineCurrentCategory();
            this.divIds = Array.from({length: 15}, (_, i) => (i + 1).toString());
        }

        getJsonData() {
            try {
                return JSON.parse(document.getElementById("data").textContent);
            } catch (e) {
                console.error('Error parsing JSON data:', e);
                return null;
            }
        }

        determineCurrentCategory() {
            const path = window.location.pathname;
            return Object.keys(CONFIG.categoryConfigs)
                .find(category => path.includes(`/${category}`)) || 'default';
        }

        async init() {
            if (this.loaderScript.getAttribute("run") !== "true") {
                console.log("Loader script is not set to run");
                return;
            }

            await this.setupHead();
            this.createComponentDivs();
            this.setupKeyboardShortcuts();
            await this.loadComponents();
        }

        async setupHead() {
            await this.loadGTM();
            await this.loadHeadTemplate();
            this.loaderScript.setAttribute("run", "false");
        }

        loadGTM() {
            const { id, domain } = CONFIG.gtm;
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://${domain}/gtag/js?id=${id}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', id);
        }

        async loadHeadTemplate() {
            try {
                const response = await fetch(`${CONFIG.basePath}template-head.html`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                document.head.insertAdjacentHTML('afterbegin', html);
            } catch (error) {
                console.error('Error loading head template:', error);
            }
        }

        createComponentDivs() {
            this.divIds.forEach(id => {
                const div = document.createElement('div');
                div.id = id;
                document.body.appendChild(div);
            });
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === 'y') {
                    this.loadDraftComponents = true;
                    console.log("Loading draft components");
                    this.loadComponents();
                }
            });
        }

        async loadComponents() {
            const components = this.generateComponentList();
            const promises = components.map((component, index) => 
                this.loadComponent(component, this.divIds[index]));

            try {
                await Promise.all(promises);
                console.log("All components loaded successfully");
                this.populateMeta();
            } catch (error) {
                console.error('Error loading components:', error);
            }
        }

        generateComponentList() {
            if (!this.shouldLoadContent()) {
                return this.generateComingSoonList();
            }

            const config = CONFIG.categoryConfigs[this.currentCategory];
            return [
                ...CONFIG.baseComponents.map(comp => `${CONFIG.basePath}${comp}.html`),
                `${CONFIG.basePath}${config.hero}.html`,
                this.jsonData?.post_html,
                ...config.specific.map(comp => `${CONFIG.basePath}${comp}.html`)
            ].filter(Boolean);
        }

        generateComingSoonList() {
            const { hero, specific } = CONFIG.comingSoon;
            return [
                ...CONFIG.baseComponents.map(comp => `${CONFIG.basePath}${comp}.html`),
                `${CONFIG.basePath}${hero}.html`,
                ...specific.map(comp => `${CONFIG.basePath}${comp}.html`)
            ];
        }

        shouldLoadContent() {
            return this.loadDraftComponents || (this.jsonData && this.jsonData.is_draft !== true);
        }

        async loadComponent(component, divId) {
            const div = document.getElementById(divId);
            if (!div) return;

            if (typeof component === 'string' && component.startsWith('/')) {
                try {
                    const response = await fetch(component);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    div.innerHTML = await response.text();
                } catch (error) {
                    console.error(`Error loading component ${component}:`, error);
                }
            } else if (component) {
                div.innerHTML = component;
            }
        }

        populateMeta() {
            if (!this.jsonData || this.jsonData.is_draft === true) {
                console.warn("Draft content or missing JSON data");
                return;
            }

            const { title, description, keywords, domain, url, 'ld-script': ldScript } = this.jsonData;
            
            document.title = title || '';
            this.updateMetaTag('description', description);
            this.updateMetaTag('keywords', keywords);
            this.updateCanonicalLink(domain, url);
            this.updateStructuredData(ldScript);
        }

        updateMetaTag(name, content) {
            const meta = document.querySelector(`meta[name="${name}"]`);
            if (meta && content) meta.setAttribute("content", content);
        }

        updateCanonicalLink(domain, url) {
            const link = document.querySelector('link[rel="canonical"]');
            if (link && domain && url) link.setAttribute("href", `https://${domain}/${url}`);
        }

        updateStructuredData(ldScript) {
            const script = document.querySelector('script[type="application/ld+json"]');
            if (script && ldScript) script.textContent = JSON.stringify(ldScript);
        }
    }

    // Initialize and run the loader
    const loader = new ComponentLoader();
    loader.init();
})();
