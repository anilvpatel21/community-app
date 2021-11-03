import React, { useState, useContext } from 'react';
import { StyleSheet, Text, ScrollView, Image, ToastAndroid, ActivityIndicator } from 'react-native';

function TermsAndCondition() {
    return (
        <ScrollView style={styles.content}>
            {/* <h2 style="text-align: center;">TERMS AND CONDITIONS</h2> */}
            <Text>Last updated: 2021-11-01</Text>
            <Text style={styles.headerText}>1. Introduction</Text>
            <Text>Welcome to KKP Samaj Raipur App</Text>

            <Text>Our Privacy Policy also governs your use of app and explains how we collect, safeguard and disclose information that results from your use of the app.</Text>
            <Text>Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.</Text>
            <Text>If you do not agree with (or cannot comply with) Agreements, then you may not use the App, but please let us know by emailing at anilpatel.gondia@gmail.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use App.</Text>
            <Text style={styles.headerText}>2. Communications</Text>
            <Text>By using our App, you agree to subscribe to notification, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by setting in your moblie devices.</Text>

            <Text style={styles.headerText}>3. Contests, Sweepstakes and Promotions</Text>
            <Text>Any contests, sweepstakes or other promotions (collectively, “Promotions”) made available through App may be governed by rules that are separate from these Terms of App. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of App, Promotion rules will apply.</Text>

            <Text style={styles.headerText}>4. Content</Text><Text>Our App allows you to post comments, link, share and otherwise make available certain information, text, graphics, videos, or other material (“Content”). You are responsible for Content that you post on or through App, including its legality, reliability, and appropriateness.</Text><Text>By posting Content on or through App, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through App does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.</Text><Text>You retain any and all of your rights to any Content you submit, post or display on or through App and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through App. However, by posting Content using App you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through App. You agree that this license includes the right for us to make your Content available to other users of App, who may also use your Content subject to these Terms.</Text><Text>KKP Samaj Raipur App has the right but not the obligation to monitor and edit all Content provided by users.</Text><Text>In addition, Content found on or through this App are the property of KKP Raipur Samaj Mobile App or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</Text>
            <Text style={styles.headerText}>7. Prohibited Uses</Text>
            <Text>You may use App only for lawful purposes and in accordance with Terms. You agree not to use App:</Text>
            <Text>0.1. In any way that violates any applicable national or international law or regulation.</Text>
            <Text>0.2. For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</Text>
            <Text>0.3. To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.</Text>
            <Text>0.4. To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</Text>
            <Text>0.5. In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</Text>
            <Text>0.6. To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of App, or which, as determined by us, may harm or offend Company or users of App or expose them to liability.</Text>
            <Text>Additionally, you agree not to:</Text>
            <Text>0.1. Use App in any manner that could disable, overburden, damage, or impair App or interfere with any other party’s use of App, including their ability to engage in real time activities through App.</Text>
            <Text>0.2. Use any robot, spider, or other automatic device, process, or means to access App for any purpose, including monitoring or copying any of the material on App.</Text>
            <Text>0.3. Use any manual process to monitor or copy any of the material on App or for any other unauthorized purpose without our prior written consent.</Text>
            <Text>0.4. Use any device, software, or routine that interferes with the proper working of App.</Text>
            <Text>0.5. Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</Text>
            <Text>0.6. Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of App, the server on which App is stored, or any server, computer, or database connected to App.</Text>
            <Text>0.7. Attack App via a denial-of-App attack or a distributed denial-of-App attack.</Text>
            <Text>0.8. Take any action that may damage or falsify Company rating.</Text>
            <Text>0.9. Otherwise attempt to interfere with the proper working of App.</Text>
            <Text style={styles.headerText}>8. Analytics</Text>
            <Text>We may use third-party App Providers to monitor and analyze the use of our App.</Text>
            <Text style={styles.headerText}>9. No Use By Minors</Text>
            <Text>App is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using App, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of App.</Text>
            <Text style={styles.headerText}>10. Accounts</Text><Text>When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on App.</Text><Text>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our App or a third-party App. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</Text><Text>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.</Text><Text>We reserve the right to refuse App, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</Text>
            <Text style={styles.headerText}>11. Intellectual Property</Text>
            <Text>App and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of KKP Raipur Samaj Mobile App and its licensors. App is protected by copyright, trademark, and other laws of  and foreign countries. Our trademarks may not be used in connection with any product or App without the prior written consent of KKP Raipur Samaj Mobile App.</Text>
            <Text style={styles.headerText}>12. Copyright Policy</Text>
            <Text>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on App infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.</Text>
            <Text>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to anilpatel.gondia@gmail.com, with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “DMCA Notice and Procedure for Copyright Infringement Claims”</Text>
            <Text>You may be held accountable for damages (including costs and attorneys’ fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through App on your copyright.</Text>
            <Text style={styles.headerText} >13. DMCA Notice and Procedure for Copyright Infringement Claims</Text>
            <Text>You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):</Text>
            <Text>0.1. an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright’s interest;</Text>
            <Text>0.2. a description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work;</Text>
            <Text>0.3. identification of the URL or other specific location on App where the material that you claim is infringing is located;</Text>
            <Text>0.4. your address, telephone number, and email address;</Text>
            <Text>0.5. a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</Text>
            <Text>0.6. a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.</Text>
            <Text>You can contact our Copyright Agent via email at anilpatel.gondia@gmail.com.</Text>
            <Text style={styles.headerText} >14. Error Reporting and Feedback</Text>
            <Text>You may provide us either directly at anilpatel.gondia@gmail.com or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our App (“Feedback”). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.</Text>
            <Text style={styles.headerText} >15. Links To Other Web Sites</Text>
            <Text>Our App may contain links to third party web sites or services that are not owned or controlled by KKP Raipur Samaj Mobile App.</Text>
            <Text>KKP Raipur Samaj Mobile App has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.</Text>

            <Text>YOU ACKNOWLEDGE AND AGREE THAT COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.</Text>
            <Text>WE STRONGLY ADVISE YOU TO READ THE TERMS OF App AND PRIVACY POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.</Text>
            <Text style={styles.headerText} >16. Disclaimer Of Warranty</Text>
            <Text>THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE” BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.</Text>
            <Text>NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.</Text>
            <Text>COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.</Text>
            <Text>THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</Text>
            <Text style={styles.headerText} >17. Limitation Of Liability</Text>
            <Text>EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS’ FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.</Text>
            <Text style={styles.headerText} >18. Termination</Text>
            <Text>We may terminate or suspend your account and bar access to App immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.</Text>
            <Text>If you wish to terminate your account, you may simply discontinue using App.</Text>
            <Text>All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</Text>
            <Text style={styles.headerText} >19. Governing Law</Text>
            <Text>These Terms shall be governed and construed in accordance with the laws of Maharashtra, which governing law applies to agreement without regard to its conflict of law provisions.</Text>
            <Text>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our App and supersede and replace any prior agreements we might have had between us regarding App.</Text>
            <Text style={styles.headerText} >20. Changes To App</Text>
            <Text>We reserve the right to withdraw or amend our App, and any App or material we provide via App, in our sole discretion without notice. We will not be liable if for any reason all or any part of App is unavailable at any time or for any period. From time to time, we may restrict access to some parts of App, or the entire App, to users, including registered users.</Text>
            <Text style={styles.headerText} >21. Amendments To Terms</Text>
            <Text>We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.</Text>
            <Text>Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.</Text>
            <Text>By continuing to access or use our App after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use App.</Text>
            <Text style={styles.headerText}>22. Waiver And Severability</Text>
            <Text>No waiver by Company of any term or condition set forth in Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under Terms shall not constitute a waiver of such right or provision.</Text>
            <Text>If any provision of Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of Terms will continue in full force and effect.</Text>
            <Text style={styles.headerText}>23. Acknowledgement</Text>
            <Text>BY USING APP OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF APP AND AGREE TO BE BOUND BY THEM.</Text>
            <Text style={styles.headerText}>24. Contact Us</Text>
            <Text>Please send your feedback, comments, requests for technical support by email: anilpatel.gondia@gmail.com.</Text>

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#80bfff',
    },
    content: {
        marginHorizontal: 10,
        marginVertical: 20
    },
    button: {
        marginVertical: 10,
        justifyContent: "center",
        backgroundColor: '#004080'
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5
    }
});

export default TermsAndCondition;