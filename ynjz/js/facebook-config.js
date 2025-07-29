// Facebook广告投放配置文件
const FacebookConfig = {
    // Pixel配置
    pixel: {
        id: 'YOUR_PIXEL_ID', // 替换为实际的Pixel ID
        events: {
            pageView: 'PageView',
            lead: 'Lead',
            viewContent: 'ViewContent',
            contact: 'Contact',
            completeRegistration: 'CompleteRegistration'
        }
    },
    
    // A/B测试变体配置
    variants: {
        headline: {
            A: "Obrolan untuk Mendapatkan Penghasilan Harian $1–20!",
            B: "Ngobrol santai di ponsel, gajian setiap hari.",
            C: "零投资在线赚钱，日收入$1-20美元"
        },
        cta: {
            A: "Mulai Hasilkan Sekarang",
            B: "Dapatkan Tutorial Gratis",
            C: "Pelajari Lebih Lanjut Sekarang"
        },
        urgency: {
            A: "Kesempatan Terbatas, Hanya untuk 100 Pendaftar Pertama",
            B: "Penawaran Hari Ini, Kuota Terbatas",
            C: "Balas dalam 24 Jam untuk Diskon Khusus"
        }
    },
    
    // 转化事件配置
    conversionEvents: {
        heroCTA: {
            event: 'Lead',
            parameters: {
                content_name: 'hero_cta_click',
                content_category: 'primary_conversion',
                value: 1.0,
                currency: 'USD'
            }
        },
        whatsappContact: {
            event: 'Contact',
            parameters: {
                content_name: 'whatsapp_contact',
                content_category: 'contact_method',
                value: 2.0,
                currency: 'USD'
            }
        },
        formSubmit: {
            event: 'CompleteRegistration',
            parameters: {
                content_name: 'form_submission',
                content_category: 'registration',
                value: 5.0,
                currency: 'USD'
            }
        },
        exitIntent: {
            event: 'Lead',
            parameters: {
                content_name: 'exit_intent_engagement',
                content_category: 'retention',
                value: 1.5,
                currency: 'USD'
            }
        }
    },
    
    // 受众配置
    audiences: {
        interests: [
            'online earning',
            'work from home',
            'passive income',
            'side hustle',
            'freelancing',
            'digital marketing',
            'affiliate marketing',
            'entrepreneurship'
        ],
        demographics: {
            ageMin: 18,
            ageMax: 45,
            genders: ['all'],
            locations: ['worldwide'] // 根据需要调整
        }
    },
    
    // 广告创意配置
    creatives: {
        images: [
            'assets/images/hero-background.jpg',
            'assets/images/success-story.jpg',
            'assets/images/mobile-earning.jpg'
        ],
        videos: [
            // 视频文件路径（如有）
        ],
        headlines: [
            "Hasilkan uang dengan obrolan online, $1-20 setiap hari",
            "Pilihan baru untuk pekerjaan paruh waktu, bisa dimulai dengan ponsel",
            "Peluang bisnis tanpa modal, mulai hasilkan uang sekarang"
        ],
        descriptions: [
            "Hanya dengan satu ponsel, dapatkan penghasilan stabil melalui obrolan online. Waktu kerja fleksibel, penghasilan dapat ditarik kapan saja.",
            "Dukungan pelatihan profesional, kuasai operasi dalam 5 menit. Bergabunglah dengan kami dan mulailah perjalanan penghasilan online Anda.",
            "Studi kasus penghasilan nyata, disaksikan oleh banyak siswa yang sukses. Mudah dipelajari, cocok untuk semua kalangan."
        ]
    }
};

// A/B测试管理器
class ABTestManager {
    constructor() {
        this.currentVariant = this.getVariant();
        this.initializeVariant();
    }
    
    // 获取用户的测试变体
    getVariant() {
        let variant = localStorage.getItem('ab_variant');
        if (!variant) {
            // 随机分配变体
            const variants = ['A', 'B', 'C'];
            variant = variants[Math.floor(Math.random() * variants.length)];
            localStorage.setItem('ab_variant', variant);
        }
        return variant;
    }
    
    // 初始化变体内容
    initializeVariant() {
        // 更新标题
        const heroTitle = document.querySelector('.value-proposition');
        if (heroTitle && FacebookConfig.variants.headline[this.currentVariant]) {
            heroTitle.textContent = FacebookConfig.variants.headline[this.currentVariant];
        }
        
        // 更新CTA按钮
        const ctaButtons = document.querySelectorAll('.cta-button.primary');
        ctaButtons.forEach(button => {
            if (FacebookConfig.variants.cta[this.currentVariant]) {
                button.textContent = FacebookConfig.variants.cta[this.currentVariant];
            }
        });
        
        // 更新紧迫感文案
        const urgencyText = document.querySelector('.urgency-content p');
        if (urgencyText && FacebookConfig.variants.urgency[this.currentVariant]) {
            urgencyText.textContent = FacebookConfig.variants.urgency[this.currentVariant];
        }
        
        // 追踪变体分配
        this.trackVariantAssignment();
    }
    
    // 追踪变体分配
    trackVariantAssignment() {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: `variant_${this.currentVariant}`,
                content_category: 'ab_test',
                custom_parameter_1: this.currentVariant
            });
        }
    }
    
    // 追踪变体转化
    trackVariantConversion(eventName) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: `${eventName}_variant_${this.currentVariant}`,
                content_category: 'ab_test_conversion',
                custom_parameter_1: this.currentVariant
            });
        }
    }
}

// 高级转化追踪
class ConversionTracker {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 1,
            scrollDepth: 0,
            timeOnPage: 0,
            interactions: []
        };
        this.initializeTracking();
    }
    
    // 初始化追踪
    initializeTracking() {
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackUserInteractions();
        this.trackFormInteractions();
    }
    
    // 追踪滚动深度
    trackScrollDepth() {
        let maxScrollDepth = 0;
        const milestones = [25, 50, 75, 100];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                this.sessionData.scrollDepth = maxScrollDepth;
                
                // 追踪里程碑
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !this.sessionData[`scroll_${milestone}`]) {
                        this.sessionData[`scroll_${milestone}`] = true;
                        this.trackEvent('scroll_milestone', {
                            scroll_depth: milestone,
                            time_to_scroll: Date.now() - this.sessionData.startTime
                        });
                    }
                });
            }
        });
    }
    
    // 追踪页面停留时间
    trackTimeOnPage() {
        setInterval(() => {
            this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
        }, 1000);
        
        // 页面卸载时发送数据
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                time_on_page: this.sessionData.timeOnPage,
                scroll_depth: this.sessionData.scrollDepth,
                interactions: this.sessionData.interactions.length
            });
        });
    }
    
    // 追踪用户交互
    trackUserInteractions() {
        // 点击追踪
        document.addEventListener('click', (e) => {
            const interaction = {
                type: 'click',
                element: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now() - this.sessionData.startTime
            };
            this.sessionData.interactions.push(interaction);
        });
        
        // 鼠标移动追踪（简化版）
        let mouseMoveCount = 0;
        document.addEventListener('mousemove', () => {
            mouseMoveCount++;
            if (mouseMoveCount % 100 === 0) { // 每100次鼠标移动记录一次
                this.sessionData.interactions.push({
                    type: 'mouse_activity',
                    count: mouseMoveCount,
                    timestamp: Date.now() - this.sessionData.startTime
                });
            }
        });
    }
    
    // 追踪表单交互
    trackFormInteractions() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // 聚焦追踪
            input.addEventListener('focus', () => {
                this.trackEvent('form_field_focus', {
                    field_name: input.name || input.id,
                    field_type: input.type
                });
            });
            
            // 输入追踪
            input.addEventListener('input', () => {
                this.trackEvent('form_field_input', {
                    field_name: input.name || input.id,
                    field_type: input.type,
                    has_value: input.value.length > 0
                });
            });
        });
    }
    
    // 通用事件追踪方法
    trackEvent(eventName, parameters = {}) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: eventName,
                content_category: 'user_behavior',
                ...parameters
            });
        }
    }
}

// 初始化Facebook配置
document.addEventListener('DOMContentLoaded', function() {
    // 初始化A/B测试
    const abTest = new ABTestManager();
    
    // 初始化转化追踪
    const tracker = new ConversionTracker();
    
    // 将实例添加到全局作用域以便其他脚本使用
    window.FacebookABTest = abTest;
    window.ConversionTracker = tracker;
    
    // 更新原有的trackConversion函数
    const originalTrackConversion = window.trackConversion;
    window.trackConversion = function(eventName) {
        // 调用原有函数
        if (originalTrackConversion) {
            originalTrackConversion(eventName);
        }
        
        // 追踪A/B测试转化
        abTest.trackVariantConversion(eventName);
        
        // 追踪高级转化事件
        const eventConfig = FacebookConfig.conversionEvents[eventName];
        if (eventConfig && typeof fbq !== 'undefined') {
            fbq('track', eventConfig.event, eventConfig.parameters);
        }
    };
});

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacebookConfig;
}

