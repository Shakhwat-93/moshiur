import React from 'react';

export default function InfoSection() {
  return (
    <section className="vb2-sec alt" id="info">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">প্রয়োজনীয় তথ্য</span>
          <h2 className="vb2-title">
            কেন নেবেন, <em>কীভাবে ব্যবহার করবেন?</em>
          </h2>
          <p className="vb2-lead">
            সহজ ভাষায় সব দরকারি তথ্য এক নজরে দেখে নিন।
          </p>
        </div>

        <div className="vb2-info">
          {/* Info 1 */}
          <div className="vb2-ic">
            <h3><span className="e">✨</span> জিরো এলার্জি কেন নেবেন?</h3>
            <ul>
              <li><span className="mk">✔️</span> <strong>অভিজ্ঞ হাকিমদের ফর্মুলা:</strong> দীর্ঘদিনের অভিজ্ঞতা ও ক্লিনিক্যাল গবেষণার নিখুঁত সংমিশ্রণে প্রস্তুত।</li>
              <li><span className="mk">✔️</span> <strong>স্থায়ী সুস্থতা:</strong> নিয়ম অনুযায়ী ১-২ মাসের কোর্স সম্পন্ন করলে স্থায়ী সমাধান সম্ভব ইনশাআল্লাহ।</li>
              <li><span className="mk">✔️</span> <strong>কোনো পার্শ্বপ্রতিক্রিয়া নেই:</strong> শতভাগ নিরাপদ ভেষজ গুল্মে তৈরি, যা তন্দ্রাভাব বা আসক্তি তৈরি করে না।</li>
              <li><span className="mk">✔️</span> <strong>কাস্টমার সাপোর্ট:</strong> সেবনকালীন যেকোনো পরামর্শের জন্য আমাদের হেল্পলাইনে সরাসরি কথা বলার সুবিধা।</li>
            </ul>
          </div>

          {/* Info 2 */}
          <div className="vb2-ic">
            <h3><span className="e">📝</span> সেবনের সহজ নিয়ম</h3>
            <ol>
              <li><strong>সকালবেলা:</strong> সকালে ভরা পেটে ১টি ট্যাবলেট সাধারণ পানি বা কুসুম গরম পানি দিয়ে সেবন করবেন।</li>
              <li><strong>রাত্রিবেলা:</strong> রাতে খাবার খাওয়ার পর ১টি ট্যাবলেট সেবন করবেন।</li>
              <li><strong>পরামর্শ:</strong> নিয়মিত ব্যবহারে দ্রুত ও স্থায়ী ফলাফল পাওয়া যায়। অতিরিক্ত মসলাযুক্ত খাবার সাময়িক পরিহার করা উত্তম।</li>
            </ol>
          </div>

          {/* Info 3 */}
          <div className="vb2-ic">
            <h3><span className="e">🌿</span> শতভাগ প্রাকৃতিক উপাদান</h3>
            <ul>
              <li><span className="mk">🌱</span> নিম ও চিরতার নির্যাস — রক্ত থেকে বিষাক্ত টক্সিন ও জীবাণু দূর করে।</li>
              <li><span className="mk">🌱</span> আমলকী ও হরিতকী — শরীরের রোগ প্রতিরোধ ক্ষমতা বহুগুণ বৃদ্ধি করে।</li>
              <li><span className="mk">🌱</span> হলুদ ও যষ্টিমধু — প্রাকৃতিক অ্যান্টি-হিস্টামিন ও প্রদাহনাশক হিসেবে কাজ করে।</li>
              <li><span className="mk">🌱</span> দুর্লভ পাহাড়ি ভেষজ সংমিশ্রণ — ত্বকের স্বাভাবিক উজ্জ্বলতা ফিরিয়ে আনে।</li>
            </ul>
          </div>

          {/* Info 4 */}
          <div className="vb2-ic">
            <h3><span className="e">📖</span> পণ্য ডেলিভারি ও নিশ্চয়তা</h3>
            <div className="rich">
              <p>
                <strong>১০০% ক্যাশ অন ডেলিভারি:</strong> কোনো প্রকার অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন। কুরিয়ার প্রতিনিধি আপনার ঠিকানায় পার্সেল নিয়ে গেলে প্যাকেট দেখে মূল্য পরিশোধ করবেন।
              </p>
              <p>
                <strong>সারা দেশে ফ্রি ডেলিভারি:</strong> ঢাকা সিটি কিংবা প্রত্যন্ত গ্রাম—সারা বাংলাদেশের যেকোনো প্রান্তে ফ্রি হোম ডেলিভারি সুবিধা।
              </p>
              <p>
                <strong>পণ্য নিয়ে যেকোনো জিজ্ঞাসা:</strong> আমাদের সাপোর্ট টিমের সাথে সরাসরি ফোনে বা হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
