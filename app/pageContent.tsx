'use client'

import { Section, HeroSection, Main } from '@heymarco/section'

import { AccordionItem, Carousel, Container, ExclusiveAccordion, Icon } from '@reusable-ui/components'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'
import { Image } from '@heymarco/image'
import { useEffect } from 'react'
import { usePrefetchProductList, usePrefetchPriceList, usePrefetchCountryList } from '@/store/features/api/apiSlice'



const useHomeStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'@/styles/home')
, { id: 'home' });



export default function HomePageContent() {
    const styles = useHomeStyleSheet();
    
    
    
    const prefetchProductList = usePrefetchProductList();
    const prefetchPriceList = usePrefetchPriceList();
    const prefetchCountryList = usePrefetchCountryList();
    useEffect(() => {
        const cancelPrefetch = setTimeout(() => {
            prefetchProductList();
            prefetchPriceList();
            prefetchCountryList();
        }, 100);
        
        
        
        return () => {
            clearTimeout(cancelPrefetch);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <>
            <Main nude={true}>
                <HeroSection theme='secondary' className={styles.hero}>
                    <Carousel className='slides fill' nude={true} size='lg' theme='primary' mild={false}>
                        {[1,2,3,4,5].map(item =>
                            <Image
                                key={item}
                                
                                alt=''
                                src={`/slides/${item}.jpg`}
                                sizes='100vw'
                                
                                priority={true}
                            />
                        )}
                    </Carousel>
                    <Container tag='footer' className='fill' theme='primary' mild={false} gradient={true}>
                        <Icon className='scroller' icon='scrolldown' size='xl' />
                        {/* <span className='hint'>Scroll down to see more.</span> */}
                    </Container>
                </HeroSection>
                <Section className={styles.story} title='Our Story' theme='secondary'>
                    <p>
                        ART is an acronym for Atika and Rossalia Tomlinson, they are best friends from
                        high school. In 2019, they decided to follow their dreams and launch ART – their
                        own sustainable swimwear brand. Their vision was to create a reversible swimwear
                        range by combining eco friendly materials with various Indonesian batik and
                        weaving designs.
                    </p>
                    <p>
                        Both Atika and Rossalia are passionate about the conservation of Indonesia&apos;s
                        beautiful oceans, beaches and communities. The girls wanted ART to team up with
                        Art and Nature community whose aim is to empower the people of Indonesia with
                        the skills and education needed to integrate sustainability into their communities
                    </p>
                    <p>
                        In conclusion, by introducing ART ethnic swimwear to the world stage we all really
                        can be “<strong>At one with ART and nature.</strong>”
                    </p>
                </Section>
                <Section className={styles.fabrics} title='Eco-friendly fabrics' theme='secondary' mild={false}>
                    <p>
                        Sustainability and being eco-friendly is fully integrated into our strategy.
                    </p>
                    <p>
                        We proudly use VITA fabric, made with
                        Econyl® regenerated nylon from made
                        from abandoned fishing nets and
                        REPREVE® made from recycled plastic in
                        our swimwear production.
                    </p>
                    <Section className={styles.howWorks} title='How does it work?' mild={false}>
                        <ExclusiveAccordion defaultExpandedListIndex={0} theme='primary' listStyle='content'>
                            <AccordionItem label={<><Icon icon='search' size='xl' /> Collecting</>}>
                                <div className='how-work-item'>
                                    <p>
                                        Ghost fishing nets and plastic waste
                                        are collected around the globe through
                                        different initiatives such as Healthy Seas.
                                        From 2013 to 2018, they collected 453
                                        tons of fishing nets, which equals the
                                        weight of three blue whales!
                                    </p>
                                    <Image
                                        className='illus'
                                        
                                        alt=''
                                        src='/illus/turtle.jpg'
                                        // width={200*1.5} height={200}
                                        sizes='200px'
                                    />
                                </div>
                            </AccordionItem>
                            <AccordionItem label={<><Icon icon='refresh' size='xl' /> Recycling</>}>
                                <div className='how-work-item'>
                                    <p>
                                        The material is then transformed back
                                        to its original purity after a regeneration
                                        process.
                                        The yarn is blended with Lycra® Xtra
                                        Life™ to ensure optimal support while
                                        remaining soft and stretchy.
                                        Our swimwear is UV protective, and
                                        highly resistant to chlorine, sun creams
                                        and oils.
                                    </p>
                                    <Image
                                        className='illus'
                                        
                                        alt=''
                                        src='/illus/particles.jpg'
                                        // width={200*1.5} height={200}
                                        sizes='200px'
                                    />
                                </div>
                            </AccordionItem>
                        </ExclusiveAccordion>
                    </Section>
                </Section>
                <Section className={styles.regeneration} title='THE ECONYL® REGENERATION SYSTEM' theme='secondary' mild={true}>
                    <Image
                        className='illus fill-self'
                        
                        alt='product regeneration'
                        src='/illus/product-cycle.jpg'
                        // width={800*0.5} height={590*0.5}
                        sizes='350px'
                    />
                    <ExclusiveAccordion defaultExpandedListIndex={0} theme='primary' listStyle='content'>
                        <AccordionItem label={<><Icon icon='medical_services' size='xl' /> Rescue</>}>
                            <p>
                                The ECONYL® Regeneration System
                                starts with rescuing waste, like fishing
                                nets, fabric scraps, carpet flooring and
                                industrial plastic from landfills and
                                oceans all over the world. That waste
                                is then sorted and cleaned to recover
                                all of the nylon possible.
                            </p>
                        </AccordionItem>
                        <AccordionItem label={<><Icon icon='refresh' size='xl' /> Regenerate</>}>
                            <p>
                                Through a radical regeneration
                                and purification process, the nylon
                                waste is recycled right back to its
                                original purity. That means ECONYL®
                                regenerated nylon is exactly the same as virgin nylon.
                            </p>
                        </AccordionItem>
                        <AccordionItem label={<><Icon icon='autorenew' size='xl' /> Remake</>}>
                            <p>
                                ECONYL® regenerated nylon is
                                processed into
                                carpet yarn and textile yarn for the
                                fashion and interior industries.
                            </p>
                        </AccordionItem>
                        <AccordionItem label={<><Icon icon='imagesearch_roller' size='xl' /> Reimagine</>}>
                            <p>
                                The beauty of ECONYL® regenerated
                                nylon is that it has the potential to be
                                recycled infinitely, without ever losing
                                its quality. We believe circular design
                                is the future and using ECONYL® is
                                our first step on that journey.
                            </p>
                        </AccordionItem>
                    </ExclusiveAccordion>
                </Section>
                <Section className={styles.ethic} title='Ethically Manufactured' theme='secondary' mild={false}>
                    <div className='paragraphs'>
                        <p>
                            Our swimwear is made in a local
                            factories in Bali, Indonesia We wanted
                            to ensure that the factories we chose to
                            produce our swimwear matched with
                            our values.
                        </p>
                        <p>
                            We researched numerous different
                            options throughout Indonesia and
                            hand selected our factories due to their
                            morals, ethical responsibilities and
                            sustainable practices.
                        </p>
                        <p>
                            A talented crew of well paid, Indonesian
                            tailors produce our swimwear in good,
                            clean and modern factory conditions.
                        </p>
                        <p>
                            We feel privileged to be able to support
                            local Balinese businesses. They in
                            turn, help us to make our dreams
                            become reality by supplying you with
                            our beautiful eco-friendly, sustainable
                            pieces of ART.
                        </p>
                        <p>
                            We also commit to being totally
                            transparent with our customers and are
                            very happy to share behind the scenes
                            images and videos on our Instagram
                            page @art_ethnicswim
                        </p>
                        <p>
                            Here you can see our models and
                            the other beautiful souls who are
                            all working together, helping us to
                            produce beautiful works or ART.
                        </p>
                    </div>
                    <Image
                        className='illus fill'
                        
                        alt='Factory'
                        src='/illus/factory.jpg'
                        sizes='100vw'
                    />
                </Section>
                <Section className={styles.community} title='Give Back to The Community and Planet' theme='primary' mild={false}>
                    <p>
                        More than 12 million Indonesians lack education and creative skills. They are paid 50% less
                        than the minimum salary. We believe it&apos;s time for change.
                    </p>
                    <p>
                        We have chosen to team up with Art and Nature community. Organization leads an art
                        and eco-friendly campaign whose aim is to educate the less fortunate people of Indonesia,
                        teaching them skills which will enable them to develop sustainable communities
                        throughout Indonesia.
                    </p>
                    <p>
                        Organization that carry out a great field job by providing education facilities, professional
                        training, accommodation, and creating job opportunities
                    </p>
                    <Image
                        className='illus fill'
                        
                        src='/illus/community.jpg'
                        alt='Community'
                        sizes='100vw'
                    />
                </Section>
            </Main>
        </>
    )
}
