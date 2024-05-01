import { bebas } from "@/lib/fonts";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="border border-t-0 border-l-0 border-r-0 pb-20">
      <div className="max-2xl:mx-10 mt-10 md:mt-20">
        <h1 className={`${bebas.className} text-5xl md:text-7xl uppercase`}>
          Terms &
        </h1>
        <h1 className={`${bebas.className} text-5xl md:text-7xl uppercase`}>
          Conditions
        </h1>
        {/* separator */}
        <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:my-14 "></div>
      </div>

      <p className="font-thin mb-4">
        Please read these terms and conditions carefully before using Our
        Service.
      </p>

      <div className="flex flex-col gap-10 ">
        <p>
          Welcome to Explosion Proof Electrical Control! These terms and
          conditions outline the rules and regulations for the use of our
          manufacturing facility.
        </p>
        <p>
          By accessing or using our manufacturing plant, we assume you accept
          these terms and conditions in full. Do not continue to use Explosion
          Proof Electrical Control if you do not accept all of the terms and
          conditions stated on this page.
        </p>
        <ol className="list-decimal text-xl space-y-10 pl-4">
          <li>
            Safety Regulations:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                All visitors, employees, and contractors must adhere to our
                safety regulations at all times. This includes wearing
                appropriate personal protective equipment (PPE) and following
                established safety protocols.
              </li>
              <li>
                Smoking, open flames, or any other activities that may pose a
                fire hazard are strictly prohibited within the manufacturing
                facility.
              </li>
            </ul>
          </li>

          <li>
            Intellectual Property:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                All intellectual property rights related to our manufacturing
                processes, designs, and products remain the property of
                [Flameproof Manufacturing Plant].
              </li>
              <li>
                Unauthorized use, reproduction, or distribution of our
                intellectual property is strictly prohibited.
              </li>
            </ul>
          </li>

          <li>
            Confidentiality:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                Any confidential information obtained during visits or
                interactions with our manufacturing plant must be kept
                confidential and not disclosed to third parties without explicit
                consent.
              </li>
            </ul>
          </li>

          <li>
            Quality Assurance:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                We strive to maintain the highest quality standards in our
                manufacturing processes and products.
              </li>
              <li>
                Customers or visitors are encouraged to report any quality
                concerns or issues promptly to our quality assurance team.
              </li>
            </ul>
          </li>

          <li>
            Environmental Responsibility:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                We are committed to environmental sustainability and responsible
                manufacturing practices.
              </li>
              <li>
                All employees and visitors are expected to support our
                environmental initiatives and comply with relevant environmental
                regulations.
              </li>
            </ul>
          </li>

          <li>
            Liability and Indemnity:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                [Flameproof Manufacturing Plant] shall not be liable for any
                damages, losses, or injuries resulting from the use of our
                manufacturing facility or products, unless caused by our
                negligence.
              </li>
              <li>
                Visitors and contractors agree to indemnify and hold harmless
                [Flameproof Manufacturing Plant] from any claims arising from
                their use of the facility.
              </li>
            </ul>
          </li>

          <li>
            Access and Security:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                Access to certain areas of the manufacturing plant may be
                restricted to authorized personnel only.
              </li>
              <li>
                Visitors and contractors must sign in and obtain necessary
                clearance before entering the plant premises.
              </li>
            </ul>
          </li>

          <li>
            Changes to Terms and Conditions:
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                [Flameproof Manufacturing Plant] reserves the right to modify or
                update these terms and conditions at any time without prior
                notice.
              </li>
              <li>
                It is the responsibility of visitors, employees, and contractors
                to review these terms periodically for changes.
              </li>
            </ul>
          </li>

          <li>
            Interpretation
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </li>
            </ul>
          </li>
          <li>
            Acknowledgment
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                These are the Terms and Conditions governing the use of this
                Service and the agreement that operates between You and the
                Company. These Terms and Conditions set out the rights and
                obligations of all users regarding the use of the Service.
              </li>
              <li>
                Your access to and use of the Service is conditioned on Your
                acceptance of and compliance with these Terms and Conditions.
                These Terms and Conditions apply to all visitors, users and
                others who access or use the Service.
              </li>
              <li>
                By accessing or using the Service You agree to be bound by these
                Terms and Conditions. If You disagree with any part of these
                Terms and Conditions then You may not access the Service.
              </li>
              <li>
                You represent that you are over the age of 18. The Company does
                not permit those under 18 to use the Service.
              </li>
              <li>
                Your access to and use of the Service is also conditioned on
                Your acceptance of and compliance with the Privacy Policy of the
                Company. Our Privacy Policy describes Our policies and
                procedures on the collection, use and disclosure of Your
                personal information when You use the Application or the Website
                and tells You about Your privacy rights and how the law protects
                You. Please read Our Privacy Policy carefully before using Our
                Service.
              </li>
            </ul>
          </li>
          <li>
            Links to Other Websites
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                Our Service may contain links to third-party web sites or
                services that are not owned or controlled by the Company.
              </li>
              <li>
                The Company has no control over, and assumes no responsibility
                for, the content, privacy policies, or practices of any third
                party web sites or services. You further acknowledge and agree
                that the Company shall not be responsible or liable, directly or
                indirectly, for any damage or loss caused or alleged to be
                caused by or in connection with the use of or reliance on any
                such content, goods or services available on or through any such
                web sites or services.
              </li>
              <li>
                We strongly advise You to read the terms and conditions and
                privacy policies of any third-party web sites or services that
                You visit.
              </li>
            </ul>
          </li>
          <li>
            Termination
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                We may terminate or suspend Your access immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if You breach these Terms and Conditions.
                Upon termination, Your right to use the Service will cease
                immediately.
              </li>
            </ul>
          </li>
          <li>
            Limitation of Liability
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                Notwithstanding any damages that You might incur, the entire
                liability of the Company and any of its suppliers under any
                provision of this Terms and Your exclusive remedy for all of the
                foregoing shall be limited to the amount actually paid by You
                through the Service or 100 USD if You haven't purchased anything
                through the Service.
              </li>
              <li>
                To the maximum extent permitted by applicable law, in no event
                shall the Company or its suppliers be liable for any special,
                incidental, indirect, or consequential damages whatsoever
                (including, but not limited to, damages for loss of profits,
                loss of data or other information, for business interruption,
                for personal injury, loss of privacy arising out of or in any
                way related to the use of or inability to use the Service,
                third-party software and/or third-party hardware used with the
                Service, or otherwise in connection with any provision of this
                Terms), even if the Company or any supplier has been advised of
                the possibility of such damages and even if the remedy fails of
                its essential purpose.
              </li>
              <li>
                Some states do not allow the exclusion of implied warranties or
                limitation of liability for incidental or consequential damages,
                which means that some of the above limitations may not apply. In
                these states, each party's liability will be limited to the
                greatest extent permitted by law.
              </li>
            </ul>
          </li>
          <li>
            "AS IS" and "AS AVAILABLE" Disclaimer
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                The Service is provided to You "AS IS" and "AS AVAILABLE" and
                with all faults and defects without warranty of any kind. To the
                maximum extent permitted under applicable law, the Company, on
                its own behalf and on behalf of its Affiliates and its and their
                respective licensors and service providers, expressly disclaims
                all warranties, whether express, implied, statutory or
                otherwise, with respect to the Service, including all implied
                warranties of merchantability, fitness for a particular purpose,
                title and non-infringement, and warranties that may arise out of
                course of dealing, course of performance, usage or trade
                practice. Without limitation to the foregoing, the Company
                provides no warranty or undertaking, and makes no representation
                of any kind that the Service will meet Your requirements,
                achieve any intended results, be compatible or work with any
                other software, applications, systems or services, operate
                without interruption, meet any performance or reliability
                standards or be error free or that any errors or defects can or
                will be corrected.
              </li>
              <li>
                Without limiting the foregoing, neither the Company nor any of
                the company's provider makes any representation or warranty of
                any kind, express or implied: (i) as to the operation or
                availability of the Service, or the information, content, and
                materials or products included thereon; (ii) that the Service
                will be uninterrupted or error-free; (iii) as to the accuracy,
                reliability, or currency of any information or content provided
                through the Service; or (iv) that the Service, its servers, the
                content, or e-mails sent from or on behalf of the Company are
                free of viruses, scripts, trojan horses, worms, malware,
                timebombs or other harmful components.
              </li>
              <li>
                Some jurisdictions do not allow the exclusion of certain types
                of warranties or limitations on applicable statutory rights of a
                consumer, so some or all of the above exclusions and limitations
                may not apply to You. But in such a case the exclusions and
                limitations set forth in this section shall be applied to the
                greatest extent enforceable under applicable law.
              </li>
            </ul>
          </li>
          <li>
            Governing Law
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                The laws of the Country, excluding its conflicts of law rules,
                shall govern this Terms and Your use of the Service. Your use of
                the Application may also be subject to other local, state,
                national, or international laws.
              </li>
            </ul>
          </li>
          <li>
            Changes to These Terms and Conditions
            <ul className={"list-disc list-inside text-lg font-thin"}>
              <li>
                We reserve the right, at Our sole discretion, to modify or
                replace these Terms at any time. If a revision is material We
                will make reasonable efforts to provide at least 30 days' notice
                prior to any new terms taking effect. What constitutes a
                material change will be determined at Our sole discretion.
              </li>
              <li>
                By continuing to access or use Our Service after those revisions
                become effective, You agree to be bound by the revised terms. If
                You do not agree to the new terms, in whole or in part, please
                stop using the website and the Service.
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default page;
