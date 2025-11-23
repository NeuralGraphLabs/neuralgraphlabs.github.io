import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { USER_NAME, REPO, DOC_FOLDER } from '@/constants';
import { GitHubItem, DocFile, DocSection } from '@/types';
import { FadeIn } from './ui/Library';

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

const DocsPage: React.FC = () => {
  const { file } = useParams<{ file?: string }>();
  const navigate = useNavigate();
  
  const [sections, setSections] = useState<DocSection[]>([]);
  const [allFiles, setAllFiles] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDocs() {
      try {
        setLoading(true);
        const rootRes = await fetch(`https://api.github.com/repos/${USER_NAME}/${REPO}/contents/${DOC_FOLDER}`);
        if (!rootRes.ok) throw new Error('Repo not found');
        const rootData: GitHubItem[] = await rootRes.json();

        const rootFiles = rootData.filter(item => item.type === 'file' && item.name.endsWith('.md'));
        const folders = rootData.filter(item => item.type === 'dir');

        const processedSections: DocSection[] = [];

        const fetchContent = async (item: GitHubItem): Promise<DocFile> => {
          const res = await fetch(item.download_url!);
          const text = await res.text();
          return {
            name: item.name,
            path: item.path,
            content: marked.parse(text) as string
          };
        };

        if (rootFiles.length > 0) {
          const filesWithContent = await Promise.all(rootFiles.map(fetchContent));
          processedSections.push({
            title: 'Overview',
            items: filesWithContent
          });
        }

        const folderPromises = folders.map(async (folder) => {
          const res = await fetch(folder.url);
          const data: GitHubItem[] = await res.json();
          const mdFiles = data.filter(f => f.type === 'file' && f.name.endsWith('.md'));
          
          if (mdFiles.length > 0) {
            const filesWithContent = await Promise.all(mdFiles.map(fetchContent));
            return {
              title: folder.name,
              items: filesWithContent
            };
          }
          return null;
        });

        const folderSections = (await Promise.all(folderPromises)).filter(Boolean) as DocSection[];
        const finalSections = [...processedSections, ...folderSections];
        const flatList = finalSections.flatMap(s => s.items);

        if (isMounted) {
          setSections(finalSections);
          setAllFiles(flatList);

          const currentExists = file && flatList.find(f => f.name === file);
          if (!file || !currentExists) {
            const defaultFile = flatList.find(f => f.name.toLowerCase().includes('overview')) || flatList[0];
            if (defaultFile) {
              navigate(`${defaultFile.name}`, { replace: true });
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load documentation library.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDocs();
    return () => { isMounted = false; };
  }, [file, navigate]);

  const selectedDoc = allFiles.find(f => f.name === file);

  const markdownStyles = `
    w-full max-w-3xl
    [&>h1]:text-4xl [&>h1]:font-light [&>h1]:text-gray-900 [&>h1]:mb-8 [&>h1]:tracking-tight
    [&>h2]:text-2xl [&>h2]:font-normal [&>h2]:text-gray-900 [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-gray-200
    [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-gray-800 [&>h3]:mt-8 [&>h3]:mb-3
    [&>p]:text-gray-500 [&>p]:font-light [&>p]:leading-loose [&>p]:mb-6 [&>p]:text-lg
    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>ul]:text-gray-500
    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6 [&>ol]:text-gray-500
    [&>li]:mb-2 [&>li]:pl-1
    [&>a]:text-sunflower-500 [&>a]:font-medium [&>a]:transition-colors [&>a]:hover:text-sunflower-600
    [&>pre]:bg-gray-900 [&>pre]:text-gray-200 [&>pre]:p-6 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-8 [&>pre]:border [&>pre]:border-gray-800
    [&>p>code]:bg-gray-100 [&>p>code]:text-gray-800 [&>p>code]:px-1.5 [&>p>code]:py-0.5 [&>p>code]:rounded [&>p>code]:text-sm [&>p>code]:font-mono [&>p>code]:border [&>p>code]:border-gray-200
    [&>img]:w-full [&>img]:h-auto [&>img]:rounded-xl [&>img]:my-8 [&>img]:shadow-sm [&>img]:border [&>img]:border-gray-100
    [&>blockquote]:border-l-4 [&>blockquote]:border-sunflower-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6
    [&>table]:w-full [&>table]:text-left [&>table]:mb-8 [&>table]:border-collapse
    [&>th]:font-medium [&>th]:text-gray-900 [&>th]:p-3 [&>th]:border-b [&>th]:border-gray-200 [&>th]:bg-gray-50
    [&>td]:p-3 [&>td]:border-b [&>td]:border-gray-100 [&>td]:text-gray-500
  `;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-start">
       <div className="animate-pulse flex flex-col items-center gap-4">
         <div className="w-8 h-8 border-2 border-sunflower-500 border-t-transparent rounded-full animate-spin"></div>
         <p className="text-gray-400 font-light">Syncing Library...</p>
       </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 pt-32 flex justify-center">
      <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg border border-red-100">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="md:w-64 shrink-0">
          <div className="sticky top-32">
            <FadeIn>
              <nav className="space-y-8">
                {sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3 pl-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-1 border-l border-gray-200 ml-1">
                      {section.items.map((f) => {
                        const isActive = f.name === file;
                        return (
                          <li key={f.name}>
                            <a
                              href={`#/docs/${f.name}`}
                              className={`block pl-4 py-2 text-sm transition-all duration-300 -ml-[1px] border-l-2 ${
                                isActive 
                                  ? 'border-sunflower-500 text-gray-900 font-medium' 
                                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                              }`}
                            >
                              {f.name.replace(/\.(md|markdown)$/, '').split('-').join(' ')}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </FadeIn>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {selectedDoc ? (
            <FadeIn key={selectedDoc.name} className="w-full">
              <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <div className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                    <span>Docs</span>
                    <span>/</span>
                    <span className="text-sunflower-500">
                      {sections.find(s => s.items.includes(selectedDoc))?.title}
                    </span>
                 </div>
                 
                 <div 
                   className={markdownStyles} 
                   dangerouslySetInnerHTML={{ __html: selectedDoc.content || '' }} 
                 />
              </article>
            </FadeIn>
          ) : (
            <div className="text-gray-400 font-light text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              Select a topic from the sidebar to view documentation
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocsPage;